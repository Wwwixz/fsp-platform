package fsp.platform.security;

import fsp.platform.common.ApiException;
import fsp.platform.user.Role;
import fsp.platform.user.UserEntity;
import fsp.platform.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Проверяет заголовок Authorization: Bearer &lt;jwt&gt; для защищённых маршрутов.
 * Публичные GET-маршруты (лента соревнований, команды, справочники) и /api/auth/* пропускаются.
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

  public static final String ATTR_AUTH_USER = "fsp.authUser";

  private final JwtService jwtService;
  private final UserRepository userRepository;

  public AuthInterceptor(JwtService jwtService, UserRepository userRepository) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler) {
    if (HttpMethod.OPTIONS.matches(request.getMethod())) {
      return true;
    }
    if (isPublic(request)) {
      return true;
    }

    String header = request.getHeader("Authorization");
    if (header == null || !header.startsWith("Bearer ")) {
      throw ApiException.unauthorized("Требуется авторизация");
    }
    long userId = jwtService.parseUserId(header.substring(7).trim());
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> ApiException.unauthorized("Пользователь не найден"));

    Role role = user.getRole();
    request.setAttribute(ATTR_AUTH_USER, new AuthUser(user.getId(), role, user.getEmail()));
    return true;
  }

  private boolean isPublic(HttpServletRequest request) {
    String path = request.getRequestURI();
    if (path.startsWith("/api/auth/")) {
      return true;
    }
    if (!HttpMethod.GET.matches(request.getMethod())) {
      return false;
    }
    // Публичное чтение: лента и детали соревнований, рейтинги команд, справочники.
    return path.startsWith("/api/competitions")
        || path.startsWith("/api/teams")
        || path.startsWith("/api/meta");
  }
}
