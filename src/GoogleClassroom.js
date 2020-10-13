function hijackYoutubeLinkClicks(e) {
    console.log("Detected a click");
    let target = e.target;
    // Interruption Criteria, <a> tags with href containing 'youtube'
    if (target.nodeName === "A") {
        let destination = target.getAttribute("href");
        if (destination.includes("youtube")) {
            console.log("Stopped redirection to Youtube");
            e.preventDefault();

            // Embed the Video
            let formattedUrl = destination.replace("youtube.com/watch?v=", "youtube.com/embed/");
            target.outerHTML += `<iframe width='420' height='315' src='${formattedUrl}?autoplay=1'></iframe>`;
        }
    }
}

window.addEventListener('load', function (e) {
    console.log("Page Loaded");
    window.addEventListener('click', hijackYoutubeLinkClicks);
});

