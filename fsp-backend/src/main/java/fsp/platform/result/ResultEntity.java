package fsp.platform.result;

import fsp.platform.competition.CompetitionEntity;
import fsp.platform.team.TeamEntity;
import fsp.platform.user.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Зафиксированный результат: место и баллы спортсмена или команды в соревновании.
 * Результат автоматически попадает в профиль участника (ТЗ, сценарий 8).
 */
@Entity
@Table(name = "results", uniqueConstraints = {
    @UniqueConstraint(name = "uk_result_user", columnNames = {"competition_id", "user_id"}),
    @UniqueConstraint(name = "uk_result_team", columnNames = {"competition_id", "team_id"})
}, indexes = {
    @Index(name = "idx_results_competition", columnList = "competition_id"),
    @Index(name = "idx_results_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "competition_id", nullable = false)
  private CompetitionEntity competition;

  /** Заполняется для личного зачёта. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private UserEntity user;

  /** Заполняется для командного зачёта. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "team_id")
  private TeamEntity team;

  /** Флаг «командный зачёт». */
  @Column(name = "is_team", nullable = false)
  private boolean teamFlag;

  @Column(nullable = false)
  private int place;

  @Column(nullable = false)
  private int points;

  @Column(name = "recorded_at", nullable = false)
  private Instant recordedAt;
}
