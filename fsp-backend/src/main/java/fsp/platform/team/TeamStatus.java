package fsp.platform.team;

/**
 * Статус команды согласно ТЗ: полный состав или «Требуются спортсмены».
 */
public enum TeamStatus {
  FORMED("Сформирована"),
  RECRUITING("Требуются спортсмены");

  private final String label;

  TeamStatus(String label) {
    this.label = label;
  }

  public String label() {
    return label;
  }
}
