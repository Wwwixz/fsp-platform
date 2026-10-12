package fsp.platform.result;

import static fsp.platform.result.ResultDtos.MyRow;

import fsp.platform.result.ResultDtos.PublishRequest;
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
@RequestMapping("/api")
public class ResultController {

  private final ResultService resultService;

  public ResultController(ResultService resultService) {
    this.resultService = resultService;
  }

  /** История выступлений текущего спортсмена. */
  @GetMapping("/results/my")
  public List<MyRow> my(@CurrentUser AuthUser authUser) {
    return resultService.myResults(authUser.id());
  }

  /** Публикация итогов соревнования организатором (сценарий 8 ТЗ). */
  @PostMapping("/competitions/{competitionId}/results")
  @ResponseStatus(HttpStatus.CREATED)
  public void publish(@PathVariable long competitionId,
                      @Valid @RequestBody PublishRequest req,
                      @CurrentUser AuthUser authUser) {
    resultService.publish(competitionId, req, authUser);
  }
}
