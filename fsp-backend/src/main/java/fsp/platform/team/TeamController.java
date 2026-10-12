package fsp.platform.team;

import static fsp.platform.team.TeamDtos.CreateRequest;
import static fsp.platform.team.TeamDtos.TeamDetails;
import static fsp.platform.team.TeamDtos.TeamsResponse;
import static fsp.platform.team.TeamDtos.Top;

import fsp.platform.security.AuthUser;
import fsp.platform.security.CurrentUser;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

  private final TeamService teamService;

  public TeamController(TeamService teamService) {
    this.teamService = teamService;
  }

  /** Публичная страница «Команды» (без авторизации). */
  @GetMapping
  public TeamsResponse teamsPage() {
    return teamService.teamsPage();
  }

  /** Публичный топ команд завершённого соревнования. */
  @GetMapping("/top")
  public List<Top> top(@RequestParam long competitionId) {
    return teamService.top(competitionId);
  }

  @GetMapping("/{id}")
  public TeamDetails get(@PathVariable long id) {
    return teamService.get(id);
  }

  /** Создание команды капитаном (сценарии 2–3 ТЗ). */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TeamDetails create(@Valid @RequestBody CreateRequest req, @CurrentUser AuthUser authUser) {
    return teamService.create(req, authUser);
  }

  /** Вступление спортсмена в формирующуюся команду (сценарий 4 ТЗ). */
  @PostMapping("/{id}/join")
  public TeamDetails join(@PathVariable long id, @CurrentUser AuthUser authUser) {
    return teamService.join(id, authUser);
  }
}
