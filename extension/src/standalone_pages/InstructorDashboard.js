import { renderActiveFeedback, renderPassiveFeedback, renderVideoAccordian } from "./InstructorDashboardRenderVideoInfo.js";

async function displayFeedback(videoObjects) {
    if (videoObjects.status) {
        videoObjects["video_info"].forEach(async function(video){
            let result = await getVideoFeedback(video);

            renderPassiveFeedback(video, result);
            renderActiveFeedback(video, result);  
        });
    }
}

function displayVideos(videoObjects) {
    let videoNav = document.getElementById("nav-videos");
    if (videoObjects.status == false) {
        videoNav.innerText = "No videos could be found";
    } else {
        renderVideoAccordian(document, videoObjects);
    }
}

async function getVideoFeedback(video) {
    return new Promise((resolve) => { 
        chrome.runtime.sendMessage({
            type: "FetchVideoFeedback",
            videoID: video.videoID
        }, (response) => {
            resolve(response);
        });
    });
}

async function getVideosPromise() {
    return new Promise((resolve) => { 
        chrome.runtime.sendMessage({
            type: "FetchVideos"
        }, (response) => {
            resolve(response);
        });
    });
}

window.onload = async function() {
    let result = await getVideosPromise();

    displayVideos(result);
    displayFeedback(result);
};
