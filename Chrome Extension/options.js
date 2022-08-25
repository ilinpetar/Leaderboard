// fill in page with stored leaderboard name
chrome.storage.sync.get("storedLeaderboardName", ({ storedLeaderboardName }) => {
    if (storedLeaderboardName) {
        document.getElementById("leaderboardName").value = storedLeaderboardName;
    }
});

// update name in use
document.getElementById("save").onclick = function () {
    chrome.storage.sync.set(
        {
            storedLeaderboardName: document.getElementById("leaderboardName").value
        },
        function () {
            // update button text to let user know options were saved
            var button = document.getElementById("save");
            button.textContent = "Saved";
            if (document.getElementById("leaderboardName").value) {
                // clear badge if name is set, and roll back to default tooltip
                chrome.action.setBadgeText({ text: "" });
                chrome.action.setTitle({ title: "Huld City Bikes Leaderboard" });
            }
            setTimeout(function () {
                window.close();
            }, 500);
        }
    );
}

// close options
document.getElementById("cancel").onclick = function () {
    window.close();
}