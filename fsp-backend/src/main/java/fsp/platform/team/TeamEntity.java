package fsp.platform.team;

import fsp.platform.competition.CompetitionEntity;
import fsp.platform.user.UserEntity;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "teams", uniqueConstraints = {
    @UniqueConstraint(name = "uk_team_in_competition", columnNames = {"competition_id", "name"})
}, indexes = {
    @Index(name = "idx_teams_competition", columnList = "competition_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamEntity {

  /** Максимальный размер состава команды на соревнование. */
  public static final int MAX_MEMBERS = 5;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "competition_id", nullable = false)
  private CompetitionEntity competition;

  /** Капитан — обязательно член команды; «висячих» команд без капитана нет. */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "captain_id", nullable = false)
  private UserEntity captain;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TeamStatus status;

  /** Контактные данные для связи с капитаном (ТЗ: атрибут команды). */
  @Column(length = 120)
  private String contact;

  @Column(nullable = false, length = 80)
  private String region;

  /** Рейтинг команды (ELO-подобный), поддерживается при публикации результатов. */
  @Column(nullable = false)
  private int rating;

  /** Счётчик побед, увеличивается при 1-м месте в соревновании. */
  @Column(nullable = false)
  private int wins;

  @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<TeamMemberEntity> members = new ArrayList<>();

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  public void addMember(UserEntity user) {
    members.add(TeamMemberEntity.builder()
        .team(this)
        .user(user)
        .joinedAt(Instant.now())
        .build());
  }
}
