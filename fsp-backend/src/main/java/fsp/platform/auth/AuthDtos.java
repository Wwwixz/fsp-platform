package fsp.platform.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO модуля авторизации. Роль приходит в терминах фронтенда:
 * «athlete» (спортсмен) или «organizer» (региональный представитель).
 */
public final class AuthDtos {

  private AuthDtos() {
  }

  public record LoginRequest(
      @NotBlank(message = "Укажите email") @Email(message = "Укажите корректный email") String email,
      @NotBlank(message = "Укажите пароль") String password) {
  }

  public record RegisterRequest(
      @NotBlank(message = "Укажите имя и фамилию")
      @Size(min = 3, max = 120, message = "Имя должно содержать от 3 до 120 символов")
      String name,
      @NotBlank(message = "Укажите email") @Email(message = "Укажите корректный email") String email,
      @NotBlank(message = "Укажите пароль")
      @Size(min = 6, max = 100, message = "Пароль должен содержать минимум 6 символов")
      String password,
      @NotBlank(message = "Выберите роль") String role,
      String region) {
  }

  /** Публичное представление пользователя для фронтенда. */
  public record PublicUser(
      long id,
      String name,
      String email,
      String role,        // «athlete» | «organizer» — роль в терминах фронтенда
      String backendRole, // ATHLETE | REGIONAL | FEDERATION
      String region) {
  }

  public record AuthResponse(String token, PublicUser user) {
  }
}
