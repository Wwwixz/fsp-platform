package fsp.platform.auth;

import fsp.platform.auth.AuthDtos.AuthResponse;
import fsp.platform.auth.AuthDtos.LoginRequest;
import fsp.platform.auth.AuthDtos.PublicUser;
import fsp.platform.auth.AuthDtos.RegisterRequest;
import fsp.platform.common.ApiException;
import fsp.platform.security.JwtService;
import fsp.platform.user.Role;
import fsp.platform.user.UserEntity;
import fsp.platform.user.UserRepository;
import java.time.Instant;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public AuthService(UserRepository userRepository, JwtService jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest req) {
    String email = req.email().trim().toLowerCase();
    if (userRepository.existsByEmail(email)) {
      throw ApiException.conflict("Пользователь с таким email уже зарегистрирован");
    }
    Role role = switch (req.role()) {
      case "athlete" -> Role.ATHLETE;
      case "organizer" -> Role.REGIONAL;
      default -> throw ApiException.badRequest("Роль может быть «athlete» или «organizer»");
    };
    UserEntity user = UserEntity.builder()
        .fullName(req.name().trim())
        .email(email)
        .passwordHash(passwordEncoder.encode(req.password()))
        .role(role)
        .region(req.region() == null || req.region().isBlank() ? "Москва" : req.region())
        .rating(0)
        .createdAt(Instant.now())
        .build();
    user = userRepository.save(user);
    return toResponse(user);
  }

  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest req) {
    UserEntity user = userRepository.findByEmail(req.email().trim().toLowerCase())
        .orElseThrow(() -> ApiException.unauthorized("Неверный email или пароль"));
    if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
      throw ApiException.unauthorized("Неверный email или пароль");
    }
    return toResponse(user);
  }

  @Transactional(readOnly = true)
  public PublicUser byId(long id) {
    return userRepository.findById(id).map(AuthService::toPublicUser)
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));
  }

  private AuthResponse toResponse(UserEntity user) {
    return new AuthResponse(jwtService.issue(user.getId(), user.getRole()), toPublicUser(user));
  }

  /** Роли FEDERATION и REGIONAL на фронтенде — «organizer». */
  private static PublicUser toPublicUser(UserEntity u) {
    return new PublicUser(
        u.getId(),
        u.getFullName(),
        u.getEmail(),
        u.getRole() == Role.ATHLETE ? "athlete" : "organizer",
        u.getRole().name(),
        u.getRegion());
  }
}
