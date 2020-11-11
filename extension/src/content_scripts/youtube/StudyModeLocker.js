let hourStart = null;
let hourEnd = null;

function addStudyModeOverlay() {
    let siteBody = document.getElementsByTagName("BODY")[0];

    // Overlay
    let overlay = document.createElement("div");
    overlay.id = "studyModeLocker";

    let caption = document.createElement("div");
    caption.id = "studyModeLockerText";
    caption.innerText = "Locked During Study Mode";

    let freeHourNotice = document.createElement("div");
    freeHourNotice.id = "studyModeLockerFreeHourNotice";
    if (hourStart && hourEnd) {
        freeHourNotice.innerText = `Youtube is available from ${hourStart} to ${hourEnd}`;
    } else {
        freeHourNotice.innerText = "Free Hours have not been set yet";
    }
    
    let lockIcon = document.createElement("I");
    lockIcon.id = "studyLockerImage";
    lockIcon.setAttribute("class", "fas fa-lock");

    // Add everything together
    overlay.appendChild(caption);
    overlay.appendChild(freeHourNotice);
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

    // eslint-disable-next-line no-unused-vars
    let promise = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "GetStudentFreeHours"
        }, (response) => {
            resolve(response);
        });
    });

    let result = await promise;
    if (result.status) {
        hourStart = result["hour_start"];
        hourEnd = result["hour_end"];
        console.debug(`Free hours are set from ${hourStart} to ${hourEnd}, current hour is ${currentHour}`);
        
        if (hourStart <= currentHour && currentHour < hourEnd) {
            console.debug("Youtube is allowed, will check again");
            // Try to apply the study mode locker every minute
            setTimeout(isInFreeHours, 60000);
        } else {
            addStudyModeOverlay();
        }
    } else {
        // Unconditionally apply the locker if free hours are not set
        addStudyModeOverlay();
    }
}

isInFreeHours();
