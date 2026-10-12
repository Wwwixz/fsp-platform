package fsp.platform.result;

import static fsp.platform.result.ResultDtos.Entry;
import static fsp.platform.result.ResultDtos.MyRow;

import fsp.platform.common.ApiException;
import fsp.platform.common.Dates;
import fsp.platform.competition.CompetitionEntity;
import fsp.platform.competition.CompetitionRepository;
import fsp.platform.competition.CompetitionStatus;
import fsp.platform.result.ResultDtos.PublishRequest;
import fsp.platform.security.AuthUser;
import fsp.platform.team.TeamEntity;
import fsp.platform.team.TeamRepository;
import fsp.platform.user.UserEntity;
import fsp.platform.user.UserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResultService {

  private final ResultRepository resultRepository;
  private final CompetitionRepository competitionRepository;
  private final TeamRepository teamRepository;
  private final UserRepository userRepository;

  public ResultService(ResultRepository resultRepository,
                       CompetitionRepository competitionRepository,
                       TeamRepository teamRepository,
                       UserRepository userRepository) {
    this.resultRepository = resultRepository;
    this.competitionRepository = competitionRepository;
    this.teamRepository = teamRepository;
    this.userRepository = userRepository;
  }

  /** История выступлений спортсмена: личные результаты + результаты его команд. */
  @Transactional(readOnly = true)
  public List<MyRow> myResults(long userId) {
    return resultRepository.findAllByUserId(userId).stream()
        .map(r -> new MyRow(
            r.getId(),
            Dates.numeric(r.getCompetition().getEndDate()),
            r.getCompetition().getEndDate().getYear(),
            r.getCompetition().getTitle(),
            r.getCompetition().getDiscipline().label(),
            r.isTeamFlag() ? "team" : "individual",
            r.getPlace(),
            r.getPoints()))
        .sorted((a, b) -> b.date().compareTo(a.date()))
        .toList();
  }

  /**
   * Публикация итогов соревнования (сценарий 8 ТЗ): организатор распределяет места и
   * вносит баллы. Результаты автоматически попадают в профили участников, растёт их
   * рейтинг; командам-победителям засчитывается победа. Повторная публикация заменяет
   * прежнюю таблицу.
   */
  @Transactional
  public void publish(long competitionId, PublishRequest req, AuthUser authUser) {
    if (!authUser.isOrganizer()) {
      throw ApiException.forbidden("Публиковать итоги могут только организаторы");
    }
    CompetitionEntity competition = competitionRepository.findById(competitionId)
        .orElseThrow(() -> ApiException.notFound("Соревнование не найдено"));
    if (!authUser.role().equals(fsp.platform.user.Role.FEDERATION)
        && !competition.getOrganizer().getId().equals(authUser.id())) {
      throw ApiException.forbidden("Итоги публикует организатор соревнования или ФСП");
    }
    if (req.entries() == null || req.entries().isEmpty()) {
      throw ApiException.badRequest("Список результатов пуст");
    }
    if (competition.getEndDate().isAfter(java.time.LocalDate.now())
        && competition.getStatus() != fsp.platform.competition.CompetitionStatus.COMPLETED) {
      throw ApiException.badRequest("Итоги публикуются после завершения соревнования");
    }

    // Откатываем влияние прежней публикации (если была) и удаляем её строки.
    for (ResultEntity old : resultRepository.findByCompetitionIdOrderByPlaceAsc(competitionId)) {
      if (old.isTeamFlag()) {
        TeamEntity team = old.getTeam();
        team.setRating(Math.max(0, team.getRating() - old.getPoints()));
        if (old.getPlace() == 1) {
          team.setWins(Math.max(0, team.getWins() - 1));
        }
      } else if (old.getUser() != null) {
        old.getUser().setRating(Math.max(0, old.getUser().getRating() - old.getPoints()));
      }
    }
    resultRepository.deleteByCompetitionId(competitionId);

    List<ResultEntity> saved = new ArrayList<>();
    for (Entry entry : req.entries()) {
      boolean hasUser = entry.userId() != null;
      boolean hasTeam = entry.teamId() != null;
      if (hasUser == hasTeam) {
        throw ApiException.badRequest("В строке итогов укажите либо спортсмена, либо команду");
      }
      UserEntity user = null;
      TeamEntity team = null;
      if (hasUser) {
        user = userRepository.findById(entry.userId())
            .orElseThrow(() -> ApiException.badRequest("Спортсмен не найден: id=" + entry.userId()));
        if (user.getRole() != fsp.platform.user.Role.ATHLETE) {
          throw ApiException.badRequest("Результат можно зафиксировать только за спортсмена");
        }
      } else {
        team = teamRepository.findWithMembersById(entry.teamId())
            .orElseThrow(() -> ApiException.badRequest("Команда не найдена: id=" + entry.teamId()));
        if (!team.getCompetition().getId().equals(competitionId)) {
          throw ApiException.badRequest("Команда участвует в другом соревновании");
        }
      }
      saved.add(ResultEntity.builder()
          .competition(competition)
          .user(user)
          .team(team)
          .teamFlag(hasTeam)
          .place(entry.place())
          .points(entry.points())
          .recordedAt(java.time.Instant.now())
          .build());
    }
    resultRepository.saveAll(saved);

    // Результат автоматически попадает в профиль: рейтинг участников растёт.
    for (ResultEntity r : saved) {
      if (r.isTeamFlag()) {
        TeamEntity team = r.getTeam();
        team.setRating(team.getRating() + r.getPoints());
        if (r.getPlace() == 1) {
          team.setWins(team.getWins() + 1);
        }
      } else {
        UserEntity user = r.getUser();
        user.setRating(user.getRating() + r.getPoints());
      }
    }

    competition.setStatus(CompetitionStatus.COMPLETED);
  }
}
