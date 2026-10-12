package fsp.platform.competition;

/**
 * Пять дисциплин платформы согласно ТЗ.
 */
public enum Discipline {
  PRODUCT("Продуктовое программирование"),
  SECURITY("Программирование систем информационной безопасности"),
  ALGORITHMIC("Алгоритмическое программирование"),
  ROBOTICS("Программирование робототехники"),
  UAV("Программирование беспилотных авиационных систем");

  private final String label;

  Discipline(String label) {
    this.label = label;
  }

  public String label() {
    return label;
  }

  public static Discipline fromLabel(String label) {
    for (Discipline d : values()) {
      if (d.label.equalsIgnoreCase(label) || d.name().equalsIgnoreCase(label)) {
        return d;
      }
    }
    throw new IllegalArgumentException("Неизвестная дисциплина: " + label);
  }
}
