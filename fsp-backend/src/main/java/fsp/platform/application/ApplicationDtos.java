package fsp.platform.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO заявок на участие.
 */
public final class ApplicationDtos {

  private ApplicationDtos() {
  }

  /** Строка таблицы заявок на фронтенде (страницы «Заявки», «Аналитика», кабинет). */
  public record Item(
      long id,
      String participant,
      boolean isTeam,
      String competition,
      long competitionId,
      String region,
      String status,   // pending | approved | rejected
      String date,     // 12.05.2026
      String time,     // 12:45
      String comment) {
  }

  /** Подача заявки (сценарии 2, 5, 7 ТЗ): лично или от имени команды капитаном. */
  public record CreateRequest(
      @NotNull(message = "Укажите соревнование") Long competitionId,
      Long teamId) {
  }

  /** Решение организатора по заявке. */
  public record DecisionRequest(
      @NotBlank(message = "Укажите статус") String status,
      String comment) {
  }
}
