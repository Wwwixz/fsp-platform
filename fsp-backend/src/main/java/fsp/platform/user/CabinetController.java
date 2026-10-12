package fsp.platform.user;

import static fsp.platform.user.CabinetDtos.CabinetResponse;

import fsp.platform.security.AuthUser;
import fsp.platform.security.CurrentUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cabinet")
public class CabinetController {

  private final CabinetService cabinetService;

  public CabinetController(CabinetService cabinetService) {
    this.cabinetService = cabinetService;
  }

  @GetMapping
  public CabinetResponse cabinet(@CurrentUser AuthUser authUser) {
    return cabinetService.cabinet(authUser.id());
  }
}
