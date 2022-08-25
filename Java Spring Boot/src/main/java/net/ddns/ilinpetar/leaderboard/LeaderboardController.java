package net.ddns.ilinpetar.leaderboard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LeaderboardController {

    @Autowired
    private HslUserRepository hslUserRepository;

    @GetMapping("/leaderboard")
    public String getLeaderboard() {

        List<HslUser> hslUsers = hslUserRepository.findAllByOrderByTotalDistanceDesc();
        StringBuffer response = new StringBuffer();
        response.append("<table>");
        response.append("<tr><th>Name</th><th>Distance [km]</th></tr>");
        for (HslUser hslUser : hslUsers) {
            response.append("<tr><td>").append(hslUser.getLeaderboardName()).append("</td><td>")
                    .append(hslUser.getTotalDistance() / 1000).append("</td></tr>");
        }
        response.append("</table>");
        return response.toString();
    }
}