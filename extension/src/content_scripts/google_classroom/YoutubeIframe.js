import { GVars, CONSTANTS } from "./GlobalVariablesAndConstants.js";
import Swal from "sweetalert2";

async function videoFinishedHandler() {
    // eslint-disable-next-line no-unused-vars
    let promise = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "FinishVideo",
            videoID: window.localStorage.getItem(CONSTANTS.YOUTUBE_VIDEO_ID),
            increment: window.localStorage.getItem(CONSTANTS.YOUTUBE_VIDEO_DURATION)
        }, (response) => {
            resolve(response);
        });
    });

    let result = await promise;
    if (result.status) {
        Swal.fire({
            icon: "success",
            text: `Great, you just finished another video. Your current coin balance is ${result.newBalance}`,
        });
    }
}

function addYoutubeIframe(rawDestination) {
    let overlay = document.getElementById("studyModeLocker");

    // TODO: we might need better extraction mechanism
    let splittedUrl = rawDestination.split(CONSTANTS.YOUTUBE_WATCH_KEYWORD);
    let videoID = CONSTANTS.DEFAULT_VIDEO_ID;
    if (splittedUrl.length == 2) {
        videoID = splittedUrl[1];
    } else {
        videoID = splittedUrl[0];
    }

    // Create nodes first
    let wrapperDiv = document.createElement("div");
    let iframe = document.createElement("iframe");

    wrapperDiv.id = "videoWrapper";
    iframe.id = "videoIFrame";
    iframe.origin = "youtube.com";
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("class", "youtubeIFrame");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoID}?enablejsapi=1&controls=0`;

    wrapperDiv.appendChild(iframe);
    overlay.appendChild(wrapperDiv);

    // Add event handlers to capture various iframe events
    // eslint-disable-next-line no-unused-vars
    GVars.player = new YT.Player("videoIFrame", {
        events: {
            "onReady": (event) =>  {
                console.debug("Embedded Youtube Player is ready");

                // Save the video id and the video title to local storage
                window.localStorage.setItem(
                    CONSTANTS.YOUTUBE_VIDEO_ID,
                    videoID
                );
                window.localStorage.setItem(
                    CONSTANTS.YOUTUBE_VIDEO_DURATION,
                    event.target.getDuration());
                window.localStorage.setItem(
                    CONSTANTS.YOUTUBE_VIDEO_TITLE,
                    event.target.getVideoData().title
                );
            },
            "onStateChange": (event) => {
                console.debug("Embedded Youtube Player has a new change");
                if (event.data == YT.PlayerState.ENDED) {
                    videoFinishedHandler();
                }
            }
        }
    });
}

export { addYoutubeIframe };
