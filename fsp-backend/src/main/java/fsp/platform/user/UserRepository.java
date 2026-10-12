package fsp.platform.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

  Optional<UserEntity> findByEmail(String email);

  boolean existsByEmail(String email);

  List<UserEntity> findByRoleOrderByRatingDesc(Role role);

  /** Сколько спортсменов того же региона имеют рейтинг выше — для «место в регионе». */
  @Query("select count(u) from UserEntity u "
      + "where u.role = fsp.platform.user.Role.ATHLETE and u.region = :region and u.rating > :rating")
  long countAthletesInRegionWithHigherRating(@Param("region") String region,
                                             @Param("rating") int rating);
}
