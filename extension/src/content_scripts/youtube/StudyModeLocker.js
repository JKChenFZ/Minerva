function addStudyModeOverlay() {
    let siteBody = document.getElementsByTagName("BODY")[0];

    // Overlay
    let overlay = document.createElement("div");
    overlay.id = "studyModeLocker";

    let caption = document.createElement("div");
    caption.id = "studyModeLockerText";
    caption.innerText = "Locked During Study Mode";
    
    let lockIcon = document.createElement("I");
    lockIcon.id = "studyLockerImage";
    lockIcon.setAttribute("class", "fas fa-lock");

    // Add everything together
    overlay.appendChild(caption);
    overlay.appendChild(lockIcon);
    siteBody.appendChild(overlay);

    // Mute the current tab
    chrome.runtime.sendMessage({ type: "MuteCurrentTab" }, (result) => {
        console.debug(`${result.status ? "Muted" : "Unable to mute"} current tab`);
    });
}

async function isInFreeHours() {
    console.debug("Checking to see if Youtube is allowed");
    let currentTime = new Date();
    let currentHour = currentTime.getHours();

    if (11 <= currentHour && currentHour <= 25) {
        console.debug("Youtube is allowed, will check again");
        // Try to apply the study mode locker every minute
        setTimeout(isInFreeHours, 60000);
    } else {
        addStudyModeOverlay();
    }
}

isInFreeHours();
