async function questionBUttonOnclick(event) {
    event.stopPropagation();
    console.debug(`Question ButtonPressed at ${player.getCurrentTime()}`);

    // try {
    //     let requestOption = getBaselineFetchOptions();
    //     requestOption.method = POST_REQUEST;
    //     requestOption.body = JSON.stringify({
    //         "videoID": window.localStorage.getItem(YOUTUBE_VIDEO_ID),
    //         "timestamp": Math.trunc(player.getCurrentTime()),
    //         "type": "active"
    //     });

    //     await fetch(`http://${API_HOST}/video/addQuestion`, requestOption);
    //     showSnackbarWithMsg(QUESTION_CONFIRMATION);
    // } catch (e) {
    //     console.error(e);
    // }
}

function exitButtonOnclick(event, eventListenerToAdd) {
    // console.log(eventListenerToAdd);
    event.stopPropagation();

    let overlay = document.getElementById("studyModeLocker");
    if (overlay) {
        overlay.remove();
        // stream.getTracks().forEach(function(track) {
        //     track.stop();
        // });
        // video = null;

        // Add the handler back
        window.addEventListener("click", eventListenerToAdd);
    }
}

function addControlButtons(callerFunction) {
    let overlay = document.getElementById("studyModeLocker");
    console.log(callerFunction);
    
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
    questionButton.addEventListener("click", (e) => questionBUttonOnclick(e));

    // Put everything together
    exitButton.appendChild(exitIcon);
    questionButton.appendChild(questionIcon);

    buttonContainer.setAttribute("class", "button-container");
    buttonContainer.appendChild(exitButton);
    buttonContainer.appendChild(questionButton);
    overlay.appendChild(buttonContainer);
}

export { addControlButtons };
