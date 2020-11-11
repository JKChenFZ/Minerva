import { renderVideoAccordian } from "./InstructorDashboardRenderVideoInfo.js";

function displayVideos(videoObjects) {
    let videoNav = document.getElementById("nav-videos");
    if (videoObjects.status == false) {
        videoNav.innerText = "No videos could be found";
    } else {
        renderVideoAccordian(document, videoObjects);
    }
}

window.onload = function() {
    chrome.runtime.sendMessage({
        type: "FetchVideos"
    }, (response) => {
        console.error(response);
        displayVideos(response);
    });
};
