package fsp.platform.auth;

import fsp.platform.auth.AuthDtos.AuthResponse;
import fsp.platform.auth.AuthDtos.LoginRequest;
import fsp.platform.auth.AuthDtos.PublicUser;
import fsp.platform.auth.AuthDtos.RegisterRequest;
import fsp.platform.security.AuthUser;
import fsp.platform.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
    return authService.register(req);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest req) {
    return authService.login(req);
  }

  @GetMapping("/me")
  public PublicUser me(@CurrentUser AuthUser authUser) {
    return authService.byId(authUser.id());
  }
}
