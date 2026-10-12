package fsp.platform.competition;

import static fsp.platform.competition.CompetitionDtos.CreateRequest;
import static fsp.platform.competition.CompetitionDtos.Details;
import static fsp.platform.competition.CompetitionDtos.Summary;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/competitions")
public class CompetitionController {

  private final CompetitionService competitionService;

  public CompetitionController(CompetitionService competitionService) {
    this.competitionService = competitionService;
  }

  /** Публичная лента соревнований (без авторизации). */
  @GetMapping
  public List<Summary> list() {
    return competitionService.list();
  }

  /** Публичные детали соревнования (без авторизации). */
  @GetMapping("/{id}")
  public Details get(@PathVariable long id) {
    return competitionService.get(id);
  }

  /** Создание соревнования — только организаторы (сценарии 1, 5, 6 ТЗ). */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Details create(@Valid @RequestBody CreateRequest req, @CurrentUser AuthUser authUser) {
    return competitionService.create(req, authUser);
  }
}
