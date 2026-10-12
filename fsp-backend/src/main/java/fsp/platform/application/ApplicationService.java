package fsp.platform.application;

import static fsp.platform.application.ApplicationDtos.CreateRequest;
import static fsp.platform.application.ApplicationDtos.DecisionRequest;
import static fsp.platform.application.ApplicationDtos.Item;

import fsp.platform.common.ApiException;
import fsp.platform.common.Dates;
import fsp.platform.competition.CompetitionEntity;
import fsp.platform.competition.CompetitionRepository;
import fsp.platform.competition.CompetitionStatus;
import fsp.platform.competition.CompetitionType;
import fsp.platform.security.AuthUser;
import fsp.platform.team.TeamEntity;
import fsp.platform.team.TeamRepository;
import fsp.platform.team.TeamStatus;
import fsp.platform.user.Role;
import fsp.platform.user.UserEntity;
import fsp.platform.user.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {

  private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

  private final ApplicationRepository applicationRepository;
  private final CompetitionRepository competitionRepository;
  private final TeamRepository teamRepository;
  private final UserRepository userRepository;

  public ApplicationService(ApplicationRepository applicationRepository,
                            CompetitionRepository competitionRepository,
                            TeamRepository teamRepository,
                            UserRepository userRepository) {
    this.applicationRepository = applicationRepository;
    this.competitionRepository = competitionRepository;
    this.teamRepository = teamRepository;
    this.userRepository = userRepository;
  }

  /**
   * Заявки для панели модерации: ФСП видит все, региональный представитель — только
   * заявки своего региона (ТЗ: «региональные представители должны иметь возможность
   * видеть заявки только своего региона»).
   */
  @Transactional(readOnly = true)
  public List<Item> listForOrganizer(AuthUser authUser) {
    UserEntity organizer = userRepository.findById(authUser.id())
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));
    if (!authUser.isOrganizer()) {
      throw ApiException.forbidden("Раздел доступен только организаторам");
    }
    return applicationRepository.findAllByOrderByCreatedAtDesc().stream()
        .filter(a -> organizer.getRole() == Role.FEDERATION
            || a.getRegion().equals(organizer.getRegion()))
        .map(ApplicationService::toItem)
        .toList();
  }

  /** Заявки текущего пользователя (кабинет спортсмена). */
  @Transactional(readOnly = true)
  public List<Item> my(AuthUser authUser) {
    return applicationRepository.findByUserIdOrderByCreatedAtDesc(authUser.id()).stream()
        .map(ApplicationService::toItem)
        .toList();
  }

  /**
   * Подача заявки. Правила ТЗ:
   * <ul>
   *   <li>сценарий 6 — на региональное соревнование принимаются заявки только
   *       из регионов соревнования, иначе система отклоняет автоматически;</li>
   *   <li>сценарий 5 — на федеральное соревнование заявку подаёт только
   *       региональный представитель;</li>
   *   <li>повторная заявка на то же соревнование запрещена.</li>
   * </ul>
   */
  @Transactional
  public Item create(CreateRequest req, AuthUser authUser) {
    UserEntity user = userRepository.findById(authUser.id())
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));
    CompetitionEntity competition = competitionRepository.findById(req.competitionId())
        .orElseThrow(() -> ApiException.notFound("Соревнование не найдено"));

    LocalDate today = LocalDate.now();
    if (competition.getStatus() == CompetitionStatus.COMPLETED
        || competition.getEndDate().isBefore(today)) {
      throw ApiException.badRequest("Соревнование уже завершено");
    }
    if (today.isAfter(competition.getRegDeadline())) {
      throw ApiException.badRequest("Регистрация на соревнование закрыта "
          + Dates.numeric(competition.getRegDeadline()));
    }
    if (applicationRepository.existsByCompetitionIdAndUserId(competition.getId(), user.getId())) {
      throw ApiException.conflict("Вы уже подали заявку на это соревнование");
    }

    TeamEntity team = null;
    if (req.teamId() != null) {
      team = teamRepository.findWithMembersById(req.teamId())
          .orElseThrow(() -> ApiException.notFound("Команда не найдена"));
      if (!team.getCaptain().getId().equals(user.getId())) {
        throw ApiException.forbidden("Командную заявку подаёт только капитан команды");
      }
      if (!team.getCompetition().getId().equals(competition.getId())) {
        throw ApiException.badRequest("Команда создана для другого соревнования");
      }
      if (team.getStatus() != TeamStatus.FORMED) {
        throw ApiException.badRequest("Команда должна быть укомплектована перед подачей заявки");
      }
    } else if (user.getRole() == Role.ATHLETE && !competition.isIndividualFormat()) {
      throw ApiException.badRequest("Соревнование требует командного участия");
    }

    if (competition.getType() == CompetitionType.FEDERAL && user.getRole() != Role.REGIONAL) {
      throw ApiException.forbidden(
          "На федеральное соревнование заявку подаёт только региональный представитель");
    }
    if (competition.getType() == CompetitionType.REGIONAL
        && !competition.getRegions().contains(user.getRegion())) {
      throw ApiException.forbidden("Соревнование доступно только для регионов: "
          + String.join(", ", competition.getRegions()));
    }

    ApplicationEntity app = ApplicationEntity.builder()
        .competition(competition)
        .user(user)
        .team(team)
        .teamFlag(team != null)
        .region(user.getRegion())
        .status(ApplicationStatus.PENDING)
        .createdAt(Instant.now())
        .build();
    app = applicationRepository.save(app);
    return toItem(app);
  }

  /** Решение организатора: одобрить / отклонить / вернуть на рассмотрение. */
  @Transactional
  public Item decide(long id, DecisionRequest req, AuthUser authUser) {
    UserEntity organizer = userRepository.findById(authUser.id())
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));
    if (!authUser.isOrganizer()) {
      throw ApiException.forbidden("Модерировать заявки могут только организаторы");
    }
    ApplicationStatus status;
    try {
      status = ApplicationStatus.fromClient(req.status());
    } catch (IllegalArgumentException e) {
      throw ApiException.badRequest("Статус должен быть pending, approved или rejected");
    }

    ApplicationEntity app = applicationRepository.findById(id)
        .orElseThrow(() -> ApiException.notFound("Заявка не найдена"));
    if (organizer.getRole() == Role.REGIONAL && !app.getRegion().equals(organizer.getRegion())) {
      throw ApiException.forbidden("Региональный представитель модерирует заявки только своего региона");
    }
    if (app.getCompetition().getStatus() == CompetitionStatus.COMPLETED) {
      throw ApiException.badRequest("Соревнование уже завершено");
    }

    app.setStatus(status);
    app.setOrganizerComment(req.comment());
    app.setDecidedAt(status == ApplicationStatus.PENDING ? null : Instant.now());
    return toItem(app);
  }

  private static Item toItem(ApplicationEntity a) {
    var createdAt = a.getCreatedAt().atZone(ZoneId.systemDefault());
    return new Item(
        a.getId(),
        a.isTeamFlag() ? a.getTeam().getName() : a.getUser().getFullName(),
        a.isTeamFlag(),
        a.getCompetition().getTitle(),
        a.getCompetition().getId(),
        a.getRegion(),
        a.getStatus().toClient(),
        Dates.numeric(createdAt.toLocalDate()),
        createdAt.format(TIME),
        a.getOrganizerComment());
  }
}
