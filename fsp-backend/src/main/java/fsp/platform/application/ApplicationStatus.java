package fsp.platform.application;

/**
 * Статусы заявок согласно ТЗ.
 */
public enum ApplicationStatus {
  PENDING("На рассмотрении"),
  APPROVED("Одобрено"),
  REJECTED("Отклонено");

  private final String label;

  ApplicationStatus(String label) {
    this.label = label;
  }

  public String label() {
    return label;
  }

  /** Строки, которые присылает фронтенд в PATCH-запросах. */
  public static ApplicationStatus fromClient(String value) {
    return switch (value) {
      case "pending" -> PENDING;
      case "approved" -> APPROVED;
      case "rejected" -> REJECTED;
      default -> throw new IllegalArgumentException("Неизвестный статус заявки: " + value);
    };
  }

  public String toClient() {
    return this == PENDING ? "pending" : this == APPROVED ? "approved" : "rejected";
  }
}
