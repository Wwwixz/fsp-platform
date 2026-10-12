package fsp.platform.common;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Единый формат ошибок для всех контроллеров: { "message": "..." }.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<Map<String, String>> handleApi(ApiException ex) {
    return ResponseEntity.status(ex.getStatus()).body(Map.of("message", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .findFirst()
        .map(err -> err.getDefaultMessage() == null ? "Некорректные данные" : err.getDefaultMessage())
        .orElse("Некорректные данные");
    return ResponseEntity.badRequest().body(Map.of("message", message));
  }

  /** Битый/нечитаемый JSON в теле запроса — ошибка клиента, а не сервера. */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<Map<String, String>> handleUnreadable(HttpMessageNotReadableException ex) {
    return ResponseEntity.badRequest().body(Map.of("message", "Некорректный формат запроса"));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, String>> handleUnexpected(Exception ex) {
    log.error("Необработанная ошибка", ex);
    return ResponseEntity.internalServerError().body(Map.of("message", "Внутренняя ошибка сервера"));
  }
}
