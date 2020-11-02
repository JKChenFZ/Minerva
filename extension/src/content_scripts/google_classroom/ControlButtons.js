import { GVars, CONSTANTS } from "./GlobalVariablesAndConstants.js";
import Swal from "sweetalert2";

function questionOnSubmit(questionText) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "AddActiveQuestion",
            videoID: window.localStorage.getItem(CONSTANTS.YOUTUBE_VIDEO_ID),
            timestamp: Math.trunc(GVars.player.getCurrentTime()),
            questionText
        }, (response) => {
            resolve(response);
        });
    });
}

async function questionButtonOnclick(event) {
    event.stopPropagation();
    GVars.player.pauseVideo();
    console.debug(`Question ButtonPressed at ${GVars.player.getCurrentTime()}`);
    
    let result = await Swal.fire({
        input: "textarea",
        inputLabel: "Have a question?",
        inputPlaceholder: "Type your question here...",
        showCancelButton: true,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        preConfirm: (questionText) => questionOnSubmit(questionText)
    });

    if (result.isConfirmed && result.value.status) {
        Swal.fire({
            icon: "success",
            text: "Great, we will let your teacher know.",
        });
    }
}

function exitButtonOnclick(event, eventListenerToAdd) {
    event.stopPropagation();

    let overlay = document.getElementById("studyModeLocker");
    if (overlay) {
        overlay.remove();
        GVars.stream.getTracks().forEach(function(track) {
            track.stop();
        });
        GVars.video = null;

        // Add the handler back
        window.addEventListener("click", eventListenerToAdd);
    }
}

function addControlButtons(callerFunction) {
    let overlay = document.getElementById("studyModeLocker");
    
    // Create nodes first
    let buttonContainer = document.createElement("DIV");
    let exitButton = document.createElement("BUTTON");
    let exitIcon = document.createElement("I");
    let questionButton = document.createElement("BUTTON");
    let questionIcon = document.createElement("I");

    // Exit button logic
    exitIcon.setAttribute("class", "fas fa-times-circle icon-left-padding");
    exitButton.setAttribute("class", "button exit-button");
    exitButton.innerText = "Leave";
    exitButton.addEventListener("click", (e) => exitButtonOnclick(e, callerFunction));

    // Question button logic
    questionIcon.setAttribute("class", "fas fa-question icon-left-padding");
    questionButton.setAttribute("class", "button question-button");
    questionButton.innerText = "Question";
    questionButton.addEventListener("click", (e) => questionButtonOnclick(e));

    // Put everything together
    exitButton.appendChild(exitIcon);
    questionButton.appendChild(questionIcon);

    buttonContainer.setAttribute("class", "button-container");
    buttonContainer.appendChild(exitButton);
    buttonContainer.appendChild(questionButton);
    overlay.appendChild(buttonContainer);
}

export { addControlButtons };
