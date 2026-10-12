package fsp.platform.application;

import static fsp.platform.application.ApplicationDtos.CreateRequest;
import static fsp.platform.application.ApplicationDtos.DecisionRequest;
import static fsp.platform.application.ApplicationDtos.Item;

import fsp.platform.security.AuthUser;
import fsp.platform.security.CurrentUser;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

  private final ApplicationService applicationService;

  public ApplicationController(ApplicationService applicationService) {
    this.applicationService = applicationService;
  }

  /** Список заявок для модерации (ФСП — все, региональный представитель — свой регион). */
  @GetMapping
  public List<Item> list(@CurrentUser AuthUser authUser) {
    return applicationService.listForOrganizer(authUser);
  }

  /** Заявки текущего пользователя. */
  @GetMapping("/my")
  public List<Item> my(@CurrentUser AuthUser authUser) {
    return applicationService.my(authUser);
  }

  /** Подача заявки (сценарии 2, 5, 7 ТЗ). */
  @PostMapping
  public Item create(@Valid @RequestBody CreateRequest req, @CurrentUser AuthUser authUser) {
    return applicationService.create(req, authUser);
  }

  /** Модерация заявки организатором. */
  @PatchMapping("/{id}")
  public Item decide(@PathVariable long id, @Valid @RequestBody DecisionRequest req,
                     @CurrentUser AuthUser authUser) {
    return applicationService.decide(id, req, authUser);
  }
}
