///////////////////////////////////////////
/////////// Button Logic
///////////////////////////////////////////
function questionBUttonOnclick(event) {
    event.stopPropagation();

    console.debug(`Question ButtonPressed at ${player.getCurrentTime()}`);
    Snackbar.show({
        pos: "bottom-center",
        text: "Got it. We will let your teacher know.",
    });
}

function exitButtonOnclick(event) {
    event.stopPropagation();

    let overlay = document.getElementById("studyModeLocker");
    if (overlay) {
        overlay.remove();
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
        video = null;

        // Add the handler back
        window.addEventListener("click", hijackYoutubeLinkClicks);
    }

}

function addControlButtons() {
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
    exitButton.addEventListener("click", (e) => exitButtonOnclick(e));

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

///////////////////////////////////////////
/////////// Embeded Youtube Logic
///////////////////////////////////////////
// The traditional approach is to add the Youtube API script programtically
// and implement the "onYouTubePlayerAPIReady" function which is invoked right
// after. Our usecase is slightly different; we have Youtube iFrame being
// loaded and unloaded dynamically. Consequently, we need to keep track of the fact
// on whether the Youtube API has been loaded previously and invoke the
// "onYouTubePlayerAPIReady" API manually. Instead, we are loading the Youtube iFrame API
// on content script load. Afterward, we directly interact with the iFrame API
const YOUTUBE_WATCH_KEYWORD = "youtube.com/watch?v=";
var player;

function addYoutubeIFrame(rawDestination) {
    let overlay = document.getElementById("studyModeLocker");

    // TODO: we might need better extraction mechanism
    let splittedUrl = rawDestination.split(YOUTUBE_WATCH_KEYWORD);
    let videoID = "hXDiv7f73H0";
    if (splittedUrl.length == 2) {
        videoID = splittedUrl[1];
    } else {
        videoID = splittedUrl[0];
    }

    // Create nodes first
    let wrapperDiv = document.createElement("div");
    let iframe = document.createElement("iframe");

    wrapperDiv.id = "videoWrapper";
    iframe.id = "videoIFrame";
    iframe.origin = "youtube.com";
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("class", "youtubeIFrame");
    iframe.src = `https://www.youtube.com/embed/${videoID}?enablejsapi=1`;

    wrapperDiv.appendChild(iframe);
    overlay.appendChild(wrapperDiv);

    // Add event handlers to capture various iFrame events
    // eslint-disable-next-line no-unused-vars
    player = new YT.Player("videoIFrame", {
        events: {
            "onReady": (event) =>  {
                console.debug("Embedded Youtube Player is ready");

                // Save the video id and the video title to local storage
                window.localStorage.setItem("youtube_video_id", videoID);
                window.localStorage.setItem(
                    "youtube_video_duration",
                    event.target.getDuration());
                window.localStorage.setItem(
                    "youtube_video_title",
                    event.target.getVideoData().title
                );
            },
            "onStateChange": () => {
                console.debug("Embedded Youtube Player has a new change");
            }
        }
    });
}

///////////////////////////////////////////
/////////// Webcam feed logic 
///////////////////////////////////////////
let video, canvas, ctx, model, stream;

async function settingUpModel() {
    await tf.wasm.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm"); // eslint-disable-line no-undef
    await tf.setBackend("wasm"); // eslint-disable-line no-undef
    model = await blazeface.load(); // eslint-disable-line no-undef
    console.log("finish loading model");
}

function setupWebcam() {
    let videoFeed = document.createElement("VIDEO");
    videoFeed.id = "overlayVideoCam";
    videoFeed.setAttribute("autoplay", "");

    let canvas = document.createElement("CANVAS");
    canvas.id = "overlayVideoCanvas";
    canvas.width = 640;
    canvas.height = 480;

    let overlay = document.getElementById("studyModeLocker");
    overlay.appendChild(videoFeed);
    overlay.appendChild(canvas);
}

async function enableCamera() {
    video = document.getElementById("overlayVideoCam");
  
    stream = await navigator.mediaDevices.getUserMedia({
        "audio": false,
        "video": { facingMode: "user" },
    });
    video.srcObject = stream;
  
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function renderPrediction() {
    if(!video)  {
        return;
    }
    const returnTensors = false;
    const annotateBoxes = true;
    const predictions = await model.estimateFaces(
        video, returnTensors);

    if (predictions.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        for (let i = 0; i < predictions.length; i++) {
            if (returnTensors) {
                console.log(predictions[i].topLeft.arraySync());
                
                predictions[i].topLeft = predictions[i].topLeft.arraySync();
                predictions[i].bottomRight = predictions[i].bottomRight.arraySync();
                if (annotateBoxes) {
                    predictions[i].landmarks = predictions[i].landmarks.arraySync();
                }
            }
  
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];
            ctx.strokeStyle = "white";
            ctx.strokeRect(start[0] , start[1], size[0], size[1]);
  
            if (annotateBoxes) {
                const landmarks = predictions[i].landmarks;
                ctx.fillStyle = "white";
                for (let j = 0; j < landmarks.length; j++) {
                    const x = landmarks[j][0];
                    const y = landmarks[j][1];
                    ctx.fillRect(x, y, 5, 5);
                }
            }
        }
    }

    requestAnimationFrame(renderPrediction);
};

// Add the webcam feed
async function integrateWebcam() {
    setupWebcam();
    await enableCamera();

    canvas = document.getElementById("overlayVideoCanvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

    renderPrediction();
}

///////////////////////////////////////////
/////////// Entry point event handler 
///////////////////////////////////////////
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

            // Add the webcam feed
            integrateWebcam();
        }
    }
}

///////////////////////////////////////////
/////////// Main Logic
///////////////////////////////////////////
// This file is guaranteed to be injected after "load" event is fired
settingUpModel();

window.addEventListener("click", hijackYoutubeLinkClicks);
console.log("Google Classroom Overlay registered");

