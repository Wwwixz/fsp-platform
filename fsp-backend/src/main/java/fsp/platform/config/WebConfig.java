package fsp.platform.config;

import fsp.platform.security.AuthInterceptor;
import fsp.platform.security.AuthUserResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  private final AuthInterceptor authInterceptor;
  private final AuthUserResolver authUserResolver;

  public WebConfig(AuthInterceptor authInterceptor, AuthUserResolver authUserResolver) {
    this.authInterceptor = authInterceptor;
    this.authUserResolver = authUserResolver;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(authInterceptor).addPathPatterns("/api/**");
  }

  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(authUserResolver);
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    // Для локальной разработки фронтенда (vite dev server на 5173).
    registry.addMapping("/api/**")
        .allowedOriginPatterns("*")
        .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*");
  }
}
