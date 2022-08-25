package net.ddns.ilinpetar.leaderboard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UploadController {

    @Autowired
    private HslUserRepository hslUserRepository;

    @PostMapping("/upload")
    public List<HslUser> uploadData(@RequestBody HslUser hslUser) {

        List<HslUser> hslUsers = hslUserRepository.findByLeaderboardName(hslUser.getLeaderboardName());
        if (hslUsers.isEmpty()) {
            hslUsers.add(hslUser);
        }
        for (HslUser user : hslUsers) {
            user.setTotalDistance(hslUser.getTotalDistance());
        }
        hslUsers = hslUserRepository.saveAll(hslUsers);

        return hslUsers;
    }
}