package fsp.platform.user;

/**
 * Три типа пользователей платформы согласно ТЗ.
 * FEDERATION и REGIONAL — организаторы (на фронтенде объединены в роль «organizer»).
 */
public enum Role {
  FEDERATION,
  REGIONAL,
  ATHLETE
}
