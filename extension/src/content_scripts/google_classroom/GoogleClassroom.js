import { addControlButtons } from "./ControlButtons.js";
import { addYoutubeIframe } from "./YoutubeIframe.js";
import { handleMessages } from "./PostLectureGameHandler";
import { GVars } from "./GlobalVariablesAndConstants";
import { integrateWebcam } from "./Webcam.js";
import { registerAddPostLectureQuestionsButton } from "./PostLectureQuestionsSubmission";
import { settingUpModel } from "./FacialDetection.js";

function getTeacherModeStatus() {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "GetTeacherMode"
        }, (response) => {
            resolve(response);
        });
    });
}

function hijackYoutubeLinkClicks(e) {
    console.log("Detected a click");

    let target = e.target;
    // Interruption Criteria, <a> tags with href containing 'youtube'
    if (target.nodeName === "A") {
        let destination = target.getAttribute("href");
        if (destination.includes("youtube")) {
            e.preventDefault();
            console.log("Stopped redirection to Youtube");

            // Remove click event listener
            window.removeEventListener("click", hijackYoutubeLinkClicks);

            // Create overlay element
            let overlay = document.createElement("div");
            overlay.id = "studyModeLocker";
            overlay.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log("Overlay clicked");
            });

            // Add overlay to the body
            let siteBody = document.getElementsByTagName("BODY")[0];
            siteBody.appendChild(overlay);

            // Populate content on the overlay
            // Embed the exit button
            addControlButtons(hijackYoutubeLinkClicks);

            // Embed the Video
            addYoutubeIframe(destination);

            // Add the webcam feed
            integrateWebcam();
        }
    }
}

async function main() {
    // Set the necessary global variables
    let getTeacherModeResult = await getTeacherModeStatus();
    GVars.teacherMode = getTeacherModeResult.status;
    console.log(`Teacher Mode Status: ${GVars.teacherMode}`);

    await settingUpModel();
    window.addEventListener("click", hijackYoutubeLinkClicks);
    window.addEventListener("message", handleMessages);
    registerAddPostLectureQuestionsButton();
    console.log("Google Classroom Overlay registered");
}

main();
