package fsp.platform.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * DTO команд: общий рейтинг, топ по соревнованию, статистика, создание и состав.
 */
public final class TeamDtos {

  private TeamDtos() {
  }

  /** Строка общего рейтинга команд (страница «Команды», режим «Общий рейтинг»). */
  public record Rating(
      long id,
      String name,
      int members,
      int rating,
      int wins,
      String region) {
  }

  /** Строка топа команд конкретного соревнования. */
  public record Top(
      long id,
      String team,
      int members,
      int points,
      String region) {
  }

  public record Stats(long total, long newThisWeek, long tournaments) {
  }

  public record CompetitionOption(long id, String title) {
  }

  /** Ответ GET /api/teams — всё для страницы «Команды» разом. */
  public record TeamsResponse(
      List<Rating> overall,
      List<CompetitionOption> competitions,
      Stats stats) {
  }

  public record TeamDetails(
      long id,
      String name,
      String competition,
      String captain,
      String status,
      String contact,
      String region,
      int members,
      List<String> memberNames) {
  }

  /** Создание команды капитаном (сценарии 2–3 ТЗ). */
  public record CreateRequest(
      @NotBlank(message = "Укажите название команды")
      @Size(min = 2, max = 100, message = "Название команды: от 2 до 100 символов")
      String name,
      @NotNull(message = "Укажите соревнование") Long competitionId,
      @Size(max = 120, message = "Контакт слишком длинный") String contact,
      boolean recruiting) {
  }
}
