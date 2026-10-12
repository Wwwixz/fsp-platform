package fsp.platform.competition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO соревнований: карточка ленты, полные детали и запрос на создание.
 */
public final class CompetitionDtos {

  private CompetitionDtos() {
  }

  /** Карточка в общей ленте (/competitions). */
  public record Summary(
      long id,
      String title,
      String date,          // «20–22 ноября 2026»
      String location,
      int participants,
      int maxParticipants,
      String type,          // Открытое | Региональное | Федеральное
      String discipline,
      String period,        // active | past
      boolean individualFormat,
      boolean registrationOpen) {
  }

  public record ScheduleDto(String time, String event) {
  }

  /** Команда в списке составов на странице соревнования. */
  public record TeamShort(
      long id,
      String name,
      int members,
      String status,        // Сформирована | Требуются спортсмены
      String captain,
      String region,
      String contact) {
  }

  /** Строка итоговой таблицы соревнования. */
  public record ResultRow(String name, boolean isTeam, int place, int points) {
  }

  public record Details(
      long id,
      String title,
      String type,
      String discipline,
      String description,
      String date,
      String location,
      int participants,
      int maxParticipants,
      String prizeFund,
      String organizer,
      List<String> regions,
      boolean individualFormat,
      boolean registrationOpen,
      boolean completed,
      List<ScheduleDto> schedule,
      List<TeamShort> teams,
      List<ResultRow> results) {
  }

  public record ScheduleItemRequest(String time, String event) {
  }

  /** Запрос на создание соревнования (сценарии 1, 5, 6 ТЗ). */
  public record CreateRequest(
      @NotBlank(message = "Укажите название") String title,
      @NotBlank(message = "Укажите формат (открытое/региональное/федеральное)") String type,
      @NotBlank(message = "Укажите дисциплину") String discipline,
      String description,
      @NotBlank(message = "Укажите место проведения") String location,
      @NotNull(message = "Укажите дату начала") LocalDate startDate,
      @NotNull(message = "Укажите дату окончания") LocalDate endDate,
      @NotNull(message = "Укажите дедлайн регистрации") LocalDate regDeadline,
      @NotNull(message = "Укажите лимит участников") Integer maxParticipants,
      String prizeFund,
      boolean individualFormat,
      List<String> regions,
      List<ScheduleItemRequest> schedule) {
  }
}
