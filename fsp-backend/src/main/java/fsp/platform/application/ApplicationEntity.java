package fsp.platform.application;

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
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "applications", indexes = {
    @Index(name = "idx_applications_competition", columnList = "competition_id"),
    @Index(name = "idx_applications_user", columnList = "user_id"),
    @Index(name = "idx_applications_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "competition_id", nullable = false)
  private CompetitionEntity competition;

  /** Подавший заявку: спортсмен (лично) или капитан (от имени команды). */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  /** Заполняется только для командной заявки. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "team_id")
  private TeamEntity team;

  /** Флаг «заявка командная» — дублирует связь team для быстрых фильтров. */
  @Column(name = "is_team", nullable = false)
  private boolean teamFlag;

  /** Регион заявителя — фиксируется на момент подачи (для модерации). */
  @Column(nullable = false, length = 80)
  private String region;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ApplicationStatus status;

  /** Комментарий организатора при одобрении/отклонении. */
  @Column(name = "organizer_comment", length = 300)
  private String organizerComment;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "decided_at")
  private Instant decidedAt;
}
