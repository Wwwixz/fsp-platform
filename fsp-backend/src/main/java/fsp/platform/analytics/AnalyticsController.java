package fsp.platform.analytics;

import static fsp.platform.analytics.AnalyticsDtos.AnalyticsResponse;

import fsp.platform.security.AuthUser;
import fsp.platform.security.CurrentUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

  private final AnalyticsService analyticsService;

  public AnalyticsController(AnalyticsService analyticsService) {
    this.analyticsService = analyticsService;
  }

  @GetMapping
  public AnalyticsResponse overview(@CurrentUser AuthUser authUser) {
    return analyticsService.overview(authUser);
  }
}
