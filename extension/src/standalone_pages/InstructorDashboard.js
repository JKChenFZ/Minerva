import { displayFeedback, renderVideoAccordian } from "./InstructorDashboardRenderVideoInfo.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

function displayVideos(videoObjects) {
    let videoNav = document.getElementById("nav-videos");
    if (videoObjects.status == false) {
        videoNav.innerText = "No videos could be found";
    } {
        renderVideoAccordian(document, videoObjects);
    }
}

window.onload = function() {
    console.log("fucking run plz");
    chrome.runtime.sendMessage({
        type: "FetchVideos"
    }, (response) => {
        console.error(response);
        displayVideos(response);
        displayFeedback(response);
    });
};
