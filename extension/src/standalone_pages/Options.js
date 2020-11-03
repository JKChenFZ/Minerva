window.onload = function() {
    let dashboardRedirectButton = document.getElementById("dashboardRedirectButton");
    dashboardRedirectButton.onclick = function() {
        chrome.tabs.create({url: chrome.extension.getURL("InstructorDashboard.html")});
    };
};