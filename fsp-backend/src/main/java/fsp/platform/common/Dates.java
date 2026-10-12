package fsp.platform.common;

import java.time.LocalDate;

/**
 * Форматирование дат в русском виде для DTO (без внешних библиотек локализации).
 */
public final class Dates {

  private static final String[] MONTHS_GENITIVE = {
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
  };
  private static final String[] MONTHS_SHORT = {
      "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
  };

  private Dates() {
  }

  /** «20–22 ноября 2026», «30 ноября – 4 декабря 2026», «13 декабря 2026». */
  public static String range(LocalDate from, LocalDate to) {
    if (from.equals(to)) {
      return dayMonthYear(from);
    }
    int f = from.getMonthValue() - 1;
    int t = to.getMonthValue() - 1;
    if (f == t && from.getYear() == to.getYear()) {
      return from.getDayOfMonth() + "–" + to.getDayOfMonth() + " "
          + MONTHS_GENITIVE[f] + " " + from.getYear();
    }
    if (from.getYear() == to.getYear()) {
      return from.getDayOfMonth() + " " + MONTHS_GENITIVE[f] + " – "
          + to.getDayOfMonth() + " " + MONTHS_GENITIVE[t] + " " + from.getYear();
    }
    return from.getDayOfMonth() + " " + MONTHS_GENITIVE[f] + " " + from.getYear() + " – "
        + to.getDayOfMonth() + " " + MONTHS_GENITIVE[t] + " " + to.getYear();
  }

  /** «25 октября 2026». */
  public static String dayMonthYear(LocalDate d) {
    return d.getDayOfMonth() + " " + MONTHS_GENITIVE[d.getMonthValue() - 1] + " " + d.getYear();
  }

  /** «12.05.2026». */
  public static String numeric(LocalDate d) {
    return "%02d.%02d.%d".formatted(d.getDayOfMonth(), d.getMonthValue(), d.getYear());
  }

  /** «Окт» по номеру месяца 1..12. */
  public static String monthShort(int month) {
    return MONTHS_SHORT[month - 1];
  }
}
