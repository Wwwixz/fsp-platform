package fsp.platform.competition;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CompetitionRepository extends JpaRepository<CompetitionEntity, Long> {

  /** Завершённые и «прошедшие по датам» соревнования — для счётчика турниров. */
  @Query("select count(c) from CompetitionEntity c where c.endDate < :today or c.status = fsp.platform.competition.CompetitionStatus.COMPLETED")
  long countCompleted(@org.springframework.data.repository.query.Param("today") LocalDate today);

  List<CompetitionEntity> findAllByOrderByStartDateAsc();
}
