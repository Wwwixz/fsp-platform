package fsp.platform.team;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<TeamEntity, Long> {

  List<TeamEntity> findAllByOrderByRatingDesc();

  boolean existsByCompetitionIdAndName(Long competitionId, String name);

  Optional<TeamEntity> findByNameAndCompetitionId(String name, Long competitionId);

  @EntityGraph(attributePaths = {"members.user", "captain"})
  List<TeamEntity> findByCompetitionIdOrderByIdAsc(Long competitionId);

  @EntityGraph(attributePaths = {"members"})
  Optional<TeamEntity> findWithMembersById(Long id);
}
