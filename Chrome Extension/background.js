// background.js

// chrome notification options
let options = {
    type: "basic",
    title: "Huld City Bikes Leaderboard",
    iconUrl: "images/huld_bicycle.png"
};

// open HSL login page if user clicks on a notification button
chrome.notifications.onButtonClicked.addListener(function (id, button) {
    console.debug("chrome.notifications.onButtonClicked listener, button clicked = ", button === 0 ? "login" : "cancel");
    if (button === 0) {
        console.info("onButtonClicked: opening HSL login page in a new tab");
        chrome.tabs.create({ url: "https://www.hsl.fi/user/auth/login?language=en" });
    }
});

// create an alarm event each 30 minutes
chrome.alarms.create("uploadCityBikesData", {
    periodInMinutes: 30,
    when: Date.now() + 60000 // start after one minute
});

// upload data each 30 minutes
chrome.alarms.onAlarm.addListener((alarm) => {
    console.debug("chrome.alarms.onAlarm listener");
    if (alarm.name === "uploadCityBikesData") {
        console.info("onAlarm: retrieving and uploading HSL City Bikes data");
        // fetch data from HSL and upload it
        uploadCityBikesData();
    }
});

// fetch data from HSL and upload it for processing
function uploadCityBikesData() {
    getLeaderboardName().then(function (leaderboardName) {
        if (!leaderboardName) {
            console.warn("uploadCityBikesData: leaderboard name missing");
            options.message = "Please set your name in extension options";
            chrome.notifications.create(options);
            setError(options.message);
            return;
        }
        // clear badge if name is set
        clearError();

        // fetch user's log
        fetch("https://www.hsl.fi/user/api/v1/citybikes/rentals?year=2022", {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status == 401) { // unauthorized, show notification with link to HSL login page
                        console.warn("fetch: unable to retrieve HSL City Bikes data, unauthorized", response);
                        options.message = "Unable to fetch data from HSL portal, please log in to HSL";
                        options.buttons = [{
                            title: "Open HSL login page"
                        }, {
                            title: "Cancel"
                        }];
                        chrome.notifications.create(options);
                        setError(options.message);
                    }
                    throw new Error("Invalid response from HSL");
                }
                // clear badge if fetch succeeds
                clearError();
                console.info("fetch: retrieved HSL City Bikes data", response);
                return response.json();
            })
            .then(data => {
                // calculate total distance by summing all journeys
                const totalDistance = data.reduce(function (result, item) {
                    return result + item.distance;
                }, 0);
                // upload data
                const uploadData = {
                    leaderboardName: leaderboardName,
                    totalDistance: totalDistance
                };

                console.info("fetch: uploading data to backend application", uploadData);
                fetch("https://orcl1-ilinpetar.ddns.net/upload", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(uploadData),
                })
                    .then(response => response.json())
                    .catch(console.error);
            })
            .catch(console.error);
    });
}

// check if leaderboard name is set, and open options page if it's not
chrome.runtime.onInstalled.addListener(() => {
    console.debug("chrome.runtime.onInstalled listener");
    getLeaderboardName().then(function (leaderboardName) {
        if (!leaderboardName) {
            console.warn("onInstalled: storedLeaderboardName missing in sync storage, opening options dialog");
            chrome.runtime.openOptionsPage();
        } else {
            console.info("onInstalled: storedLeaderboardName found in sync storage");
        }
    });
});

// check if leaderboard name is set, and open options page if it's not
chrome.runtime.onStartup.addListener(() => {
    console.debug("chrome.runtime.onStartup listener");
    getLeaderboardName().then(function (leaderboardName) {
        if (!leaderboardName) {
            console.warn("onStartup: storedLeaderboardName missing in sync storage, opening options dialog");
            chrome.runtime.openOptionsPage();
        } else {
            console.info("onStartup: storedLeaderboardName found in sync storage");
        }
    });
});

async function getLeaderboardName() {
    var promise = new Promise(function (resolve, reject) {
        chrome.storage.sync.get("storedLeaderboardName", ({ storedLeaderboardName }) => {
            resolve(storedLeaderboardName);
        });
    });
    const leaderboardName = await promise;
    return leaderboardName;
}

// set badge background color to red
chrome.action.setBadgeBackgroundColor(
    { color: '#FF0000' }
);

// show exclamation mark as badge and set tooltip
function setError(errorTooltip) {
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setTitle({ title: errorTooltip });
}

// clear badge and set default tooltip
function clearError() {
    chrome.action.setBadgeText({ text: "" });
    chrome.action.setTitle({ title: "Huld City Bikes Leaderboard" });
}