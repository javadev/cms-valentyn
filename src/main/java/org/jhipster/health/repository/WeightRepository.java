package org.jhipster.health.repository;

import org.jhipster.health.domain.Weight;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data  repository for the Weight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeightRepository extends JpaRepository<Weight, Long> {

    @Query("select weight from Weight weight where weight.user.login = ?#{principal.username}")
    List<Weight> findByUserIsCurrentUser();

    List<Weight> findAllByDateBetweenOrderByDateDesc(
        ZonedDateTime firstDate, ZonedDateTime secondDate);
}
