package fsp.platform.result;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

/**
 * DTO результатов: история выступлений спортсмена и публикация итогов организатором.
 */
public final class ResultDtos {

  private ResultDtos() {
  }

  /** Строка «История выступлений» в кабинете и на странице «Результаты». */
  public record MyRow(
      long id,
      String date,     // 12.05.2026
      int season,      // год проведения
      String title,
      String discipline,
      String type,     // individual | team
      int place,
      int points) {
  }

  /** Одна строка итоговой таблицы при публикации. */
  public record Entry(
      Long userId,
      Long teamId,
      @NotNull(message = "Укажите место") @Positive(message = "Место должно быть положительным")
      Integer place,
      @NotNull(message = "Укажите баллы") Integer points) {
  }

  /** Публикация итогов соревнования (сценарий 8 ТЗ). */
  public record PublishRequest(List<Entry> entries) {
  }
}
