package fsp.platform.security;

import fsp.platform.user.Role;

/**
 * Данные авторизованного пользователя, доступные в контроллерах через {@link CurrentUser}.
 */
public record AuthUser(long id, Role role, String email) {

  public boolean isOrganizer() {
    return role == Role.FEDERATION || role == Role.REGIONAL;
  }

  public boolean isAthlete() {
    return role == Role.ATHLETE;
  }
}
