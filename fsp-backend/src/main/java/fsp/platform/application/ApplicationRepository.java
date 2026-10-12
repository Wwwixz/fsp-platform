package fsp.platform.application;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {

  /** Одобренные заявки с составами команд — для подсчёта участников соревнований. */
  @EntityGraph(attributePaths = {"team.members"})
  List<ApplicationEntity> findByStatus(ApplicationStatus status);

  @EntityGraph(attributePaths = {"user", "team", "competition"})
  List<ApplicationEntity> findAllByOrderByCreatedAtDesc();

  boolean existsByCompetitionIdAndUserId(Long competitionId, Long userId);

  @EntityGraph(attributePaths = {"competition"})
  List<ApplicationEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

  @EntityGraph(attributePaths = {"user", "team", "competition"})
  List<ApplicationEntity> findTop5ByOrderByCreatedAtDesc();

  long countByStatus(ApplicationStatus status);

  /** Подсчёт заявок по месяцам текущего года для аналитики (PostgreSQL). */
  @Query(value = "select to_char(a.created_at, 'MM') as m, a.status as st, count(*) as cnt "
      + "from applications a "
      + "where a.created_at >= date_trunc('year', current_date) "
      + "group by 1, 2", nativeQuery = true)
  List<Object[]> countMonthlyCurrentYear();

  @Query("select count(a) from ApplicationEntity a where a.createdAt >= :from")
  long countCreatedAfter(@Param("from") java.time.Instant from);
}
