package fsp.platform.competition;

/**
 * Форматы соревнований согласно ТЗ.
 */
public enum CompetitionType {
  OPEN("Открытое"),
  REGIONAL("Региональное"),
  FEDERAL("Федеральное");

  private final String label;

  CompetitionType(String label) {
    this.label = label;
  }

  public String label() {
    return label;
  }

  public static CompetitionType fromLabel(String label) {
    for (CompetitionType t : values()) {
      if (t.label.equalsIgnoreCase(label) || t.name().equalsIgnoreCase(label)) {
        return t;
      }
    }
    throw new IllegalArgumentException("Неизвестный формат соревнования: " + label);
  }
}
