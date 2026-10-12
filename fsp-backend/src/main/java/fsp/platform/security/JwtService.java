package fsp.platform.security;

import fsp.platform.user.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Выпуск и проверка JWT (HS256). Subject — id пользователя, в claim role — роль.
 */
@Service
public class JwtService {

  private final String secret;
  private final Duration ttl;
  private SecretKey key;

  public JwtService(@Value("${jwt.secret}") String secret,
                    @Value("${jwt.ttl-days:7}") long ttlDays) {
    this.secret = secret;
    this.ttl = Duration.ofDays(ttlDays);
  }

  @PostConstruct
  void init() {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String issue(long userId, Role role) {
    Date now = new Date();
    return Jwts.builder()
        .subject(String.valueOf(userId))
        .claim("role", role.name())
        .issuedAt(now)
        .expiration(new Date(now.getTime() + ttl.toMillis()))
        .signWith(key)
        .compact();
  }

  /** Возвращает id пользователя или бросает исключение при невалидном/просроченном токене. */
  public long parseUserId(String token) {
    try {
      Claims claims = Jwts.parser().verifyWith(key).build()
          .parseSignedClaims(token).getPayload();
      return Long.parseLong(claims.getSubject());
    } catch (JwtException | IllegalArgumentException e) {
      throw fsp.platform.common.ApiException.unauthorized("Невалидный или истёкший токен");
    }
  }
}
