package fsp.platform.result;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResultRepository extends JpaRepository<ResultEntity, Long> {

  @EntityGraph(attributePaths = {"user", "team"})
  List<ResultEntity> findByCompetitionIdOrderByPlaceAsc(Long competitionId);

  void deleteByCompetitionId(Long competitionId);

  /** Личные результаты + результаты команд, где спортсмен состоит в составе. */
  @Query("select r from ResultEntity r left join fetch r.user left join fetch r.team "
      + "where r.user.id = :userId "
      + "   or r.team.id in (select m.team.id from fsp.platform.team.TeamMemberEntity m "
      + "                     where m.user.id = :userId)")
  List<ResultEntity> findAllByUserId(@Param("userId") Long userId);

  long countByUserIdAndPlace(Long userId, int place);
}
