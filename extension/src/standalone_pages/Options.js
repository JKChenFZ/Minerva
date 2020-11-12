window.onload = function() {
    let dashboardRedirectButton = document.getElementById("dashboardRedirectButton");
    dashboardRedirectButton.onclick = function() {
        chrome.tabs.create({url: chrome.extension.getURL("InstructorDashboard.html")});
    };

    let freeHoursSettingButton = document.getElementById("freeHourSettingsRedirectButton");
    freeHoursSettingButton.onclick = function() {
        chrome.tabs.create({url: chrome.extension.getURL("PostLectureGame.html")});
    };
};
