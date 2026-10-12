package fsp.platform.analytics;

import java.util.List;

/**
 * DTO аналитики организатора (сценарий 10 ТЗ).
 */
public final class AnalyticsDtos {

  private AnalyticsDtos() {
  }

  public record Stats(
      long competitions,
      long applications,
      long approved,
      String approvedShare,
      long rejected,
      String rejectedShare) {
  }

  public record MonthStat(String month, long approved, long rejected) {
  }

  public record LatestApplication(
      long id,
      String name,
      String region,
      String status,
      String time) {
  }

  public record AnalyticsResponse(
      Stats stats,
      List<MonthStat> monthly,
      List<LatestApplication> latest) {
  }
}
