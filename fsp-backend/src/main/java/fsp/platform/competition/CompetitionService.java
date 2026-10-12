package fsp.platform.competition;

import static fsp.platform.competition.CompetitionDtos.Details;
import static fsp.platform.competition.CompetitionDtos.ResultRow;
import static fsp.platform.competition.CompetitionDtos.ScheduleDto;
import static fsp.platform.competition.CompetitionDtos.Summary;
import static fsp.platform.competition.CompetitionDtos.TeamShort;

import fsp.platform.application.ApplicationEntity;
import fsp.platform.application.ApplicationRepository;
import fsp.platform.application.ApplicationStatus;
import fsp.platform.common.ApiException;
import fsp.platform.common.Dates;
import fsp.platform.result.ResultRepository;
import fsp.platform.security.AuthUser;
import fsp.platform.team.TeamEntity;
import fsp.platform.team.TeamRepository;
import fsp.platform.user.Role;
import fsp.platform.user.UserEntity;
import fsp.platform.user.UserRepository;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompetitionService {

  private final CompetitionRepository competitionRepository;
  private final ApplicationRepository applicationRepository;
  private final TeamRepository teamRepository;
  private final ResultRepository resultRepository;
  private final UserRepository userRepository;

  public CompetitionService(CompetitionRepository competitionRepository,
                            ApplicationRepository applicationRepository,
                            TeamRepository teamRepository,
                            ResultRepository resultRepository,
                            UserRepository userRepository) {
    this.competitionRepository = competitionRepository;
    this.applicationRepository = applicationRepository;
    this.teamRepository = teamRepository;
    this.resultRepository = resultRepository;
    this.userRepository = userRepository;
  }

  /** Лента соревнований: активные сверху (по дате начала), затем прошедшие. */
  @Transactional(readOnly = true)
  public List<Summary> list() {
    LocalDate today = LocalDate.now();
    Map<Long, Integer> participants = participantCounts();
    return competitionRepository.findAllByOrderByStartDateAsc().stream()
        .map(c -> toSummary(c, today, participants.getOrDefault(c.getId(), 0)))
        .sorted((a, b) -> {
          if (!a.period().equals(b.period())) {
            return a.period().equals("active") ? -1 : 1;
          }
          return 0; // внутри периода исходная сортировка по дате
        })
        .toList();
  }

  @Transactional(readOnly = true)
  public Details get(long id) {
    CompetitionEntity c = competitionRepository.findById(id)
        .orElseThrow(() -> ApiException.notFound("Соревнование не найдено"));
    LocalDate today = LocalDate.now();
    int participants = participantCounts().getOrDefault(c.getId(), 0);

    List<TeamShort> teams = teamRepository.findByCompetitionIdOrderByIdAsc(c.getId()).stream()
        .map(t -> new TeamShort(
            t.getId(),
            t.getName(),
            t.getMembers().size(),
            t.getStatus().label(),
            t.getCaptain().getFullName(),
            t.getRegion(),
            t.getContact()))
        .toList();

    List<ResultRow> results = resultRepository.findByCompetitionIdOrderByPlaceAsc(c.getId())
        .stream()
        .map(r -> new ResultRow(
            r.isTeamFlag() ? r.getTeam().getName() : r.getUser().getFullName(),
            r.isTeamFlag(),
            r.getPlace(),
            r.getPoints()))
        .toList();

    boolean completed = c.getStatus() == CompetitionStatus.COMPLETED || c.getEndDate().isBefore(today);

    return new Details(
        c.getId(),
        c.getTitle(),
        c.getType().label(),
        c.getDiscipline().label(),
        c.getDescription(),
        Dates.range(c.getStartDate(), c.getEndDate()),
        c.getLocation(),
        participants,
        c.getMaxParticipants(),
        c.getPrizeFund(),
        c.getOrganizer().getFullName(),
        List.copyOf(c.getRegions()),
        c.isIndividualFormat(),
        !completed && !LocalDate.now().isAfter(c.getRegDeadline()),
        completed,
        c.getScheduleItems().stream()
            .map(s -> new ScheduleDto(s.getTimeLabel(), s.getEventText()))
            .toList(),
        teams,
        results);
  }

  /**
   * Создание соревнования (сценарий 1 ТЗ). Региональное соревнование создаёт только
   * региональный представитель, и его регион включается автоматически; федеральное —
   * только ФСП.
   */
  @Transactional
  public Details create(CompetitionDtos.CreateRequest req, AuthUser authUser) {
    UserEntity organizer = userRepository.findById(authUser.id())
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));

    CompetitionType type = parseType(req.type());
    Discipline discipline = parseDiscipline(req.discipline());

    if (!authUser.isOrganizer()) {
      throw ApiException.forbidden("Создавать соревнования могут только организаторы");
    }
    if (type == CompetitionType.FEDERAL && organizer.getRole() != Role.FEDERATION) {
      throw ApiException.forbidden("Федеральные соревнования создаёт только ФСП");
    }
    if (req.startDate().isAfter(req.endDate())) {
      throw ApiException.badRequest("Дата начала не может быть позже даты окончания");
    }
    if (req.regDeadline().isAfter(req.startDate())) {
      throw ApiException.badRequest("Дедлайн регистрации должен быть раньше начала соревнования");
    }
    if (req.maxParticipants() <= 0) {
      throw ApiException.badRequest("Лимит участников должен быть положительным");
    }

    CompetitionEntity c = CompetitionEntity.builder()
        .title(req.title().trim())
        .type(type)
        .discipline(discipline)
        .description(req.description())
        .location(req.location().trim())
        .startDate(req.startDate())
        .endDate(req.endDate())
        .regDeadline(req.regDeadline())
        .maxParticipants(req.maxParticipants())
        .prizeFund(req.prizeFund())
        .individualFormat(req.individualFormat())
        .status(CompetitionStatus.PUBLISHED)
        .organizer(organizer)
        .createdAt(java.time.Instant.now())
        .build();

    // Региональный представитель создаёт соревнование своего региона (ТЗ, сценарий 6);
    // можно добавить и соседние регионы — получится межрегиональное.
    if (type == CompetitionType.REGIONAL) {
      c.getRegions().add(organizer.getRegion());
      if (req.regions() != null) {
        req.regions().stream().filter(r -> !r.isBlank()).forEach(c.getRegions()::add);
      }
    }
    if (req.schedule() != null) {
      for (int i = 0; i < req.schedule().size(); i++) {
        var item = req.schedule().get(i);
        if (item.time() == null || item.event() == null || item.time().isBlank()) {
          continue;
        }
        c.getScheduleItems().add(ScheduleItemEntity.builder()
            .competition(c)
            .timeLabel(item.time().trim())
            .eventText(item.event().trim())
            .position(i)
            .build());
      }
    }

    c = competitionRepository.save(c);
    return get(c.getId());
  }

  /** Количество участников: одобренные личные заявки + составы одобренных команд. */
  private Map<Long, Integer> participantCounts() {
    Map<Long, Integer> counts = new HashMap<>();
    for (ApplicationEntity a : applicationRepository.findByStatus(ApplicationStatus.APPROVED)) {
      int add = a.isTeamFlag() ? a.getTeam().getMembers().size() : 1;
      counts.merge(a.getCompetition().getId(), add, Integer::sum);
    }
    return counts;
  }

  private static Summary toSummary(CompetitionEntity c, LocalDate today, int participants) {
    boolean active = c.isActiveToday(today);
    return new Summary(
        c.getId(),
        c.getTitle(),
        Dates.range(c.getStartDate(), c.getEndDate()),
        c.getLocation(),
        participants,
        c.getMaxParticipants(),
        c.getType().label(),
        c.getDiscipline().label(),
        active ? "active" : "past",
        c.isIndividualFormat(),
        active && !today.isAfter(c.getRegDeadline()));
  }

  private static CompetitionType parseType(String value) {
    try {
      return CompetitionType.fromLabel(value);
    } catch (IllegalArgumentException e) {
      throw ApiException.badRequest("Формат должен быть: открытое, региональное или федеральное");
    }
  }

  private static Discipline parseDiscipline(String value) {
    try {
      return Discipline.fromLabel(value);
    } catch (IllegalArgumentException e) {
      throw ApiException.badRequest("Неизвестная дисциплина: " + value);
    }
  }
}
