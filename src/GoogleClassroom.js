function hijackYoutubeLinkClicks(e) {
    console.log("Detected a click");

    let target = e.target;
    // Interruption Criteria, <a> tags with href containing 'youtube'
    if (target.nodeName === "A") {
        let destination = target.getAttribute("href");
        if (destination.includes("youtube")) {
            e.preventDefault();
            console.log("Stopped redirection to Youtube");

            // Overlay
            let overlay = document.createElement('div');
            overlay.id = "studyModeLocker";

            // Add overlay to the body
            let siteBody = document.getElementsByTagName("BODY")[0];
            siteBody.appendChild(overlay);

            // Embed the Video
            let formattedUrl = destination.replace("youtube.com/watch?v=", "youtube.com/embed/");
            overlay.innerHTML += `<iframe width='420' height='315' src='${formattedUrl}?autoplay=1'></iframe>`;
        }
    }
}

window.addEventListener('load', function (e) {
    window.addEventListener('click', hijackYoutubeLinkClicks);
    console.log("Google Classroom Handler registered");
});

