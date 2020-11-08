import { renderVideoAccordian } from "./InstructorDashboardRenderVideoInfo.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

function displayVideos(videoObjects) {
    let videoNav = document.getElementById("nav-videos");
    if (videoObjects.status == false) {
        videoNav.innerHTML = "No videos could be found";
    } else {
        renderVideoAccordian(document, videoObjects);
    }
}
window.onload = function() {
    chrome.runtime.sendMessage({
        type: "FetchVideos"
    }, (response) => {
        console.log(response);
        displayVideos(response);
    });
};
