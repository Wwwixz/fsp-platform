package fsp.platform.user;

import static fsp.platform.user.CabinetDtos.CabinetResponse;
import static fsp.platform.user.CabinetDtos.Event;

import fsp.platform.application.ApplicationEntity;
import fsp.platform.application.ApplicationRepository;
import fsp.platform.common.ApiException;
import fsp.platform.common.Dates;
import fsp.platform.result.ResultRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Агрегированные данные личного кабинета спортсмена: карточка профиля,
 * показатели (рейтинг, место в регионе, победы, успешность) и ближайшие события.
 */
@Service
public class CabinetService {

  private final UserRepository userRepository;
  private final ApplicationRepository applicationRepository;
  private final ResultRepository resultRepository;

  public CabinetService(UserRepository userRepository,
                        ApplicationRepository applicationRepository,
                        ResultRepository resultRepository) {
    this.userRepository = userRepository;
    this.applicationRepository = applicationRepository;
    this.resultRepository = resultRepository;
  }

  @Transactional(readOnly = true)
  public CabinetResponse cabinet(long userId) {
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> ApiException.notFound("Пользователь не найден"));
    LocalDate today = LocalDate.now();

    // Ближайшие события: заявки на ещё не закончившиеся соревнования, одобренные или на модерации.
    List<Event> events = applicationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .filter(a -> !a.getCompetition().getEndDate().isBefore(today))
        .filter(a -> a.getStatus() == fsp.platform.application.ApplicationStatus.APPROVED
            || a.getStatus() == fsp.platform.application.ApplicationStatus.PENDING)
        .sorted(Comparator.comparing(a -> a.getCompetition().getStartDate()))
        .limit(5)
        .map(a -> new Event(
            a.getCompetition().getId(),
            a.getCompetition().getTitle(),
            Dates.range(a.getCompetition().getStartDate(), a.getCompetition().getEndDate()),
            a.getStatus() == fsp.platform.application.ApplicationStatus.APPROVED
                ? "approved" : "pending",
            a.getCompetition().getDiscipline().label()))
        .toList();

    long wins = resultRepository.countByUserIdAndPlace(userId, 1);
    long regionPlace = userRepository
        .countAthletesInRegionWithHigherRating(user.getRegion(), user.getRating()) + 1;
    long decided = applicationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .filter(a -> a.getStatus() != fsp.platform.application.ApplicationStatus.PENDING)
        .count();
    long approved = applicationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .filter(a -> a.getStatus() == fsp.platform.application.ApplicationStatus.APPROVED)
        .count();
    String successRate = decided == 0 ? "—"
        : Math.round(approved * 100.0 / decided) + "%";

    return new CabinetResponse(
        user.getId(),
        user.getFullName(),
        user.getEmail(),
        user.getRole() == Role.ATHLETE ? "athlete" : "organizer",
        user.getRegion(),
        user.getRating(),
        0, // прирост за месяц не считаем — синтетические данные статичны
        regionPlace,
        wins,
        successRate,
        events);
  }
}
