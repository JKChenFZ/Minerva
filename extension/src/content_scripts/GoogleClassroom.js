const EXIT_BUTTON_SVG = "<svg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"times-circle\" class=\"svg-inline--fa fa-times-circle fa-w-16\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path fill=\"currentColor\" d=\"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z\"></path></svg>";

function exitButtonOnclick(e) {
    if (e.target.nodeName != "path" && e.target.nodeName != "svg") {
        return;
    }

    let overlay = document.getElementById("studyModeLocker");
    if (overlay) {
        overlay.remove();
        // Add the handler back
        window.addEventListener("click", hijackYoutubeLinkClicks);
    }
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

            // Overlay
            let overlay = document.createElement("div");
            overlay.id = "studyModeLocker";

            // Add overlay to the body
            let siteBody = document.getElementsByTagName("BODY")[0];
            siteBody.appendChild(overlay);

            // Embed the exit button
            let exitButton = document.createElement("div");
            exitButton.id = "exitButton";
            exitButton.innerHTML += EXIT_BUTTON_SVG;
            overlay.appendChild(exitButton);

            // Register handler for the exit button clicks.
            // I was unable to add the handler on the 'path' tag above programmatically :(
            window.addEventListener("click", exitButtonOnclick);

            // Embed the Video
            let formattedUrl = destination.replace("youtube.com/watch?v=", "youtube.com/embed/");
            overlay.innerHTML += `<div id=videoWrapper><iframe width=100% height=100% src='${formattedUrl}'></iframe><div>`;
        }
    }
}

// eslint-disable-next-line no-unused-vars
window.addEventListener("load", function (_) {
    window.addEventListener("click", hijackYoutubeLinkClicks);
    console.log("Google Classroom Handler registered");
});

