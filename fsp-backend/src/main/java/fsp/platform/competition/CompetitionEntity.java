package fsp.platform.competition;

import fsp.platform.user.UserEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "competitions", indexes = {
    @Index(name = "idx_competitions_start_date", columnList = "start_date"),
    @Index(name = "idx_competitions_type", columnList = "type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private CompetitionType type;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private Discipline discipline;

  @Column(columnDefinition = "text")
  private String description;

  @Column(nullable = false, length = 120)
  private String location;

  @Column(name = "start_date", nullable = false)
  private LocalDate startDate;

  @Column(name = "end_date", nullable = false)
  private LocalDate endDate;

  @Column(name = "reg_deadline", nullable = false)
  private LocalDate regDeadline;

  @Column(name = "max_participants", nullable = false)
  private int maxParticipants;

  @Column(name = "prize_fund", length = 60)
  private String prizeFund;

  /** Допускается ли индивидуальная регистрация (без команды). */
  @Column(name = "individual_format", nullable = false)
  private boolean individualFormat;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private CompetitionStatus status;

  /** Для типа REGIONAL — список регионов, жители которых могут подать заявку. */
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "competition_regions", joinColumns = @JoinColumn(name = "competition_id"))
  @Column(name = "region", length = 80)
  @Builder.Default
  private Set<String> regions = new LinkedHashSet<>();

  @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("position ASC")
  @Builder.Default
  private List<ScheduleItemEntity> scheduleItems = new ArrayList<>();

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organizer_id", nullable = false)
  private UserEntity organizer;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  public boolean isActiveToday(LocalDate today) {
    return !endDate.isBefore(today);
  }
}
