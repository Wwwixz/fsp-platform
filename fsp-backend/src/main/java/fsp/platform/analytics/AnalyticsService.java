package fsp.platform.analytics;

import static fsp.platform.analytics.AnalyticsDtos.AnalyticsResponse;
import static fsp.platform.analytics.AnalyticsDtos.LatestApplication;
import static fsp.platform.analytics.AnalyticsDtos.MonthStat;
import static fsp.platform.analytics.AnalyticsDtos.Stats;

import fsp.platform.application.ApplicationEntity;
import fsp.platform.application.ApplicationRepository;
import fsp.platform.application.ApplicationStatus;
import fsp.platform.common.ApiException;
import fsp.platform.competition.CompetitionRepository;
import fsp.platform.security.AuthUser;
import fsp.platform.user.Role;
import fsp.platform.user.UserRepository;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Сводка панели организатора: счётчики, заявки по месяцам, последние заявки.
 * Региональный представитель видит статистику только по своему региону.
 */
@Service
public class AnalyticsService {

  private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");
  private static final String[] MONTHS = {
      "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
  };

  private final CompetitionRepository competitionRepository;
  private final ApplicationRepository applicationRepository;
  private final UserRepository userRepository;

  public AnalyticsService(CompetitionRepository competitionRepository,
                          ApplicationRepository applicationRepository,
                          UserRepository userRepository) {
    this.competitionRepository = competitionRepository;
    this.applicationRepository = applicationRepository;
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public AnalyticsResponse overview(AuthUser authUser) {
    var organizer = userRepository.findById(authUser.id())
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));
    if (!authUser.isOrganizer()) {
      throw ApiException.forbidden("Аналитика доступна только организаторам");
    }
    boolean federation = organizer.getRole() == Role.FEDERATION;

    List<ApplicationEntity> apps = applicationRepository.findAllByOrderByCreatedAtDesc().stream()
        .filter(a -> federation || a.getRegion().equals(organizer.getRegion()))
        .toList();

    long approved = apps.stream()
        .filter(a -> a.getStatus() == ApplicationStatus.APPROVED).count();
    long rejected = apps.stream()
        .filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();
    long total = apps.size();
    String approvedShare = total == 0 ? "0%"
        : Math.round(approved * 100.0 / total) + "%";
    String rejectedShare = total == 0 ? "0%"
        : Math.round(rejected * 100.0 / total) + "%";

    Stats stats = new Stats(
        federation ? competitionRepository.count()
            : competitionRepository.findAll().stream()
                .filter(c -> c.getOrganizer().getId().equals(organizer.getId())
                    || c.getOrganizer().getRegion().equals(organizer.getRegion()))
                .count(),
        total,
        approved,
        approvedShare,
        rejected,
        rejectedShare);

    // Заявки по месяцам текущего года (одобренные/отклонённые).
    Map<ApplicationStatus, long[]> byMonth = new EnumMap<>(ApplicationStatus.class);
    for (ApplicationStatus st : ApplicationStatus.values()) {
      byMonth.put(st, new long[12]);
    }
    int currentYear = java.time.LocalDate.now().getYear();
    for (ApplicationEntity a : apps) {
      var dt = a.getCreatedAt().atZone(ZoneId.systemDefault());
      if (dt.getYear() == currentYear) {
        byMonth.get(a.getStatus())[dt.getMonthValue() - 1]++;
      }
    }
    List<MonthStat> monthly = new java.util.ArrayList<>();
    for (int m = 0; m < 12; m++) {
      if (byMonth.get(ApplicationStatus.APPROVED)[m] > 0
          || byMonth.get(ApplicationStatus.REJECTED)[m] > 0) {
        monthly.add(new MonthStat(MONTHS[m],
            byMonth.get(ApplicationStatus.APPROVED)[m],
            byMonth.get(ApplicationStatus.REJECTED)[m]));
      }
    }

    List<LatestApplication> latest = apps.stream()
        .limit(5)
        .map(a -> new LatestApplication(
            a.getId(),
            a.isTeamFlag() ? a.getTeam().getName() : a.getUser().getFullName(),
            a.getRegion(),
            a.getStatus().toClient(),
            a.getCreatedAt().atZone(ZoneId.systemDefault()).format(TIME)))
        .toList();

    return new AnalyticsResponse(stats, monthly, latest);
  }
}
