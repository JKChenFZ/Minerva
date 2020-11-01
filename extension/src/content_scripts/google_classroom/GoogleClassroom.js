import { addControlButtons } from "./OverlayControlButtons.js";
import { addYoutubeIframe } from "./OverlayYoutubeIframe.js";

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

            // // Add the webcam feed
            // integrateWebcam();
        }
    }
}

window.addEventListener("click", hijackYoutubeLinkClicks);
console.log("Google Classroom Overlay registered");
