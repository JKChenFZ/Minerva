function exitButtonOnclick() {
    let overlay = document.getElementById("studyModeLocker");
    if (overlay) {
        overlay.remove();
        // Add the handler back
        window.addEventListener("click", hijackYoutubeLinkClicks);
    }
}

function addControlButtons() {
    let overlay = document.getElementById("studyModeLocker");
    
    // Create nodes first
    let exitButton = document.createElement("BUTTON");
    let exitIcon = document.createElement("I");

    // Program the button logic
    exitIcon.setAttribute("class", "far fa-times-circle icon-left-padding");
    exitButton.setAttribute("class", "button");
    exitButton.innerText = "Leave";
    exitButton.addEventListener("click", (e) => {
        e.stopPropagation();
        exitButtonOnclick();
    });

    exitButton.appendChild(exitIcon);
    overlay.appendChild(exitButton);
}

function addYoutubeIFrame(rawDestination) {
    let formattedUrl = rawDestination.replace("youtube.com/watch?v=", "youtube.com/embed/");
    let overlay = document.getElementById("studyModeLocker");

    // Create nodes first
    let wrapperDiv = document.createElement("div");
    let iframe = document.createElement("iframe");

    wrapperDiv.id = "videoWrapper";
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("class", "youtubeIFrame");
    iframe.src = formattedUrl;

    wrapperDiv.appendChild(iframe);
    overlay.appendChild(wrapperDiv);
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
            addControlButtons();

            // Embed the Video
            addYoutubeIFrame(destination);
        }
    }
}

// This file is guaranteed to be injected after "load" event is fired
window.addEventListener("click", hijackYoutubeLinkClicks);
console.log("Google Classroom Overlay registered");
