package net.ddns.ilinpetar.leaderboard;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class HslUser {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private String leaderboardName;

    @Column(nullable = false)
    private Integer totalDistance;

    public HslUser() {
        super();
    }

    public HslUser(String leaderboardName, Integer totalDistance) {
        super();
        this.leaderboardName = leaderboardName;
        this.totalDistance = totalDistance;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLeaderboardName() {
        return this.leaderboardName;
    }

    public void setLeaderboardName(String leaderboardName) {
        this.leaderboardName = leaderboardName;
    }

    public Integer getTotalDistance() {
        return this.totalDistance;
    }

    public void setTotalDistance(Integer totalDistance) {
        this.totalDistance = totalDistance;
    }

    @Override
    public String toString() {
        return "HslUser{" + "id=" + id + ", leaderboardName=" + leaderboardName + ", totalDistance=" + totalDistance
                + '}';
    }
}
