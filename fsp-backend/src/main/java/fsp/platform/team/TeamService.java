package fsp.platform.team;

import static fsp.platform.team.TeamDtos.CompetitionOption;
import static fsp.platform.team.TeamDtos.Rating;
import static fsp.platform.team.TeamDtos.Stats;
import static fsp.platform.team.TeamDtos.TeamDetails;
import static fsp.platform.team.TeamDtos.TeamsResponse;
import static fsp.platform.team.TeamDtos.Top;

import fsp.platform.common.ApiException;
import fsp.platform.competition.CompetitionEntity;
import fsp.platform.competition.CompetitionRepository;
import fsp.platform.competition.CompetitionStatus;
import fsp.platform.result.ResultEntity;
import fsp.platform.result.ResultRepository;
import fsp.platform.security.AuthUser;
import fsp.platform.user.UserEntity;
import fsp.platform.user.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamService {

  private final TeamRepository teamRepository;
  private final CompetitionRepository competitionRepository;
  private final ResultRepository resultRepository;
  private final UserRepository userRepository;

  public TeamService(TeamRepository teamRepository,
                     CompetitionRepository competitionRepository,
                     ResultRepository resultRepository,
                     UserRepository userRepository) {
    this.teamRepository = teamRepository;
    this.competitionRepository = competitionRepository;
    this.resultRepository = resultRepository;
    this.userRepository = userRepository;
  }

  /** Данные для страницы «Команды»: общий рейтинг, завершённые соревнования с итогами, статистика. */
  @Transactional(readOnly = true)
  public TeamsResponse teamsPage() {
    List<Rating> overall = teamRepository.findAllByOrderByRatingDesc().stream()
        .map(t -> new Rating(t.getId(), t.getName(), t.getMembers().size(),
            t.getRating(), t.getWins(), t.getRegion()))
        .toList();

    List<CompetitionOption> competitions =
        competitionRepository.findAllByOrderByStartDateAsc().stream()
            .filter(c -> c.getStatus() == CompetitionStatus.COMPLETED
                || c.getEndDate().isBefore(LocalDate.now()))
            .map(c -> new CompetitionOption(c.getId(), c.getTitle()))
            .toList();

    long weekAgo = Instant.now().minus(7, ChronoUnit.DAYS).getEpochSecond();
    long newThisWeek = teamRepository.findAll().stream()
        .filter(t -> t.getCreatedAt().getEpochSecond() >= weekAgo)
        .count();
    Stats stats = new Stats(
        teamRepository.count(),
        newThisWeek,
        competitionRepository.countCompleted(LocalDate.now()));

    return new TeamsResponse(overall, competitions, stats);
  }

  /** Топ команд завершённого соревнования по итогам (место → баллы). */
  @Transactional(readOnly = true)
  public List<Top> top(long competitionId) {
    competitionRepository.findById(competitionId)
        .orElseThrow(() -> ApiException.notFound("Соревнование не найдено"));
    return resultRepository.findByCompetitionIdOrderByPlaceAsc(competitionId).stream()
        .filter(ResultEntity::isTeamFlag)
        .map(r -> new Top(r.getTeam().getId(), r.getTeam().getName(),
            r.getTeam().getMembers().size(), r.getPoints(), r.getTeam().getRegion()))
        .toList();
  }

  @Transactional(readOnly = true)
  public TeamDetails get(long id) {
    TeamEntity t = teamRepository.findWithMembersById(id)
        .orElseThrow(() -> ApiException.notFound("Команда не найдена"));
    return toDetails(t);
  }

  /**
   * Создание команды (сценарии 2–3 ТЗ): капитан — текущий спортсмен,
   * он же первый участник состава. Статус «Требуются спортсмены» — если есть свободные места.
   */
  @Transactional
  public TeamDetails create(TeamDtos.CreateRequest req, AuthUser authUser) {
    if (!authUser.isAthlete()) {
      throw ApiException.forbidden("Команду создаёт спортсмен (капитан)");
    }
    UserEntity captain = userRepository.findById(authUser.id())
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));
    CompetitionEntity competition = competitionRepository.findById(req.competitionId())
        .orElseThrow(() -> ApiException.notFound("Соревнование не найдено"));

    LocalDate today = LocalDate.now();
    if (competition.getEndDate().isBefore(today)) {
      throw ApiException.badRequest("Соревнование уже завершено");
    }
    if (today.isAfter(competition.getRegDeadline())) {
      throw ApiException.badRequest("Регистрация на соревнование закрыта");
    }
    if (competition.getType().name().equals("FEDERAL")) {
      throw ApiException.forbidden("На федеральное соревнование заявку подаёт региональный представитель");
    }
    if (competition.getType().name().equals("REGIONAL")
        && !competition.getRegions().contains(captain.getRegion())) {
      throw ApiException.forbidden("Соревнование доступно только для регионов: "
          + String.join(", ", competition.getRegions()));
    }
    String name = req.name().trim();
    if (teamRepository.existsByCompetitionIdAndName(competition.getId(), name)) {
      throw ApiException.conflict("Команда с таким названием уже зарегистрирована на соревновании");
    }

    TeamEntity team = TeamEntity.builder()
        .name(name)
        .competition(competition)
        .captain(captain)
        .status(req.recruiting() ? TeamStatus.RECRUITING : TeamStatus.FORMED)
        .contact(req.contact() == null || req.contact().isBlank()
            ? captain.getEmail() : req.contact().trim())
        .region(captain.getRegion())
        .rating(0)
        .wins(0)
        .createdAt(Instant.now())
        .build();
    team.addMember(captain);
    team = teamRepository.save(team);
    return toDetails(team);
  }

  /** Вступление спортсмена в формирующуюся команду (сценарий 4 ТЗ, упрощённо). */
  @Transactional
  public TeamDetails join(long teamId, AuthUser authUser) {
    if (!authUser.isAthlete()) {
      throw ApiException.forbidden("Вступать в команды могут спортсмены");
    }
    UserEntity user = userRepository.findById(authUser.id())
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));
    TeamEntity team = teamRepository.findWithMembersById(teamId)
        .orElseThrow(() -> ApiException.notFound("Команда не найдена"));

    boolean alreadyMember = team.getMembers().stream()
        .anyMatch(m -> m.getUser().getId().equals(user.getId()));
    if (alreadyMember) {
      throw ApiException.conflict("Вы уже состоите в этой команде");
    }
    if (team.getStatus() != TeamStatus.RECRUITING) {
      throw ApiException.badRequest("Команда уже укомплектована");
    }
    if (team.getMembers().size() >= TeamEntity.MAX_MEMBERS) {
      throw ApiException.badRequest("В команде нет свободных мест");
    }
    if (LocalDate.now().isAfter(team.getCompetition().getRegDeadline())) {
      throw ApiException.badRequest("Регистрация на соревнование закрыта");
    }
    team.addMember(user);
    if (team.getMembers().size() >= TeamEntity.MAX_MEMBERS) {
      team.setStatus(TeamStatus.FORMED);
    }
    return toDetails(team);
  }

  private static TeamDetails toDetails(TeamEntity t) {
    return new TeamDetails(
        t.getId(),
        t.getName(),
        t.getCompetition().getTitle(),
        t.getCaptain().getFullName(),
        t.getStatus().label(),
        t.getContact(),
        t.getRegion(),
        t.getMembers().size(),
        t.getMembers().stream().map(m -> m.getUser().getFullName()).toList());
  }
}
