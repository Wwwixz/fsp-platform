package fsp.platform.user;

import java.util.List;

/**
 * DTO личного кабинета спортсмена (сценарий 9 ТЗ).
 */
public final class CabinetDtos {

  private CabinetDtos() {
  }

  /** Ближайшее событие спортсмена: одобренная/ожидающая заявка на активное соревнование. */
  public record Event(
      long id,
      String title,
      String date,
      String status, // approved | pending
      String discipline) {
  }

  public record CabinetResponse(
      long id,
      String name,
      String email,
      String role,
      String region,
      int rating,
      int ratingDelta,
      long regionPlace,
      long wins,
      String successRate,
      List<Event> upcomingEvents) {
  }
}
