package net.ddns.ilinpetar.leaderboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HslUserRepository extends JpaRepository<HslUser, Long> {
    List<HslUser> findByLeaderboardName(String leaderboardName);

    List<HslUser> findAllByOrderByTotalDistanceDesc();
}