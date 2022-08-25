// grab leaderboard data and populate HTML table
fetch("https://orcl1-ilinpetar.ddns.net/leaderboard")
    .then(response => response.text())
    .then(data => {
        console.info("fetch: retrieved leaderboard data", data);
        document.getElementById("leaderboardTable").innerHTML = data;
    })
    .catch(console.error);
