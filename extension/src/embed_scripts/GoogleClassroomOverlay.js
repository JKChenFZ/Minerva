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
function addWebcamFeed() {
    // let videoContainerDiv = document.createElement("DIV");
    // videoContainerDiv.id = "videoContainer";

    let video = document.createElement("VIDEO");
    video.id = "overlayVideoCam";
    video.setAttribute("autoplay", "");

    let canvas = document.createElement("CANVAS");
    canvas.id = "overlayVideoCanvas";
    // canvas.setAttribute("autoplay", "");

    // videoEmbedDiv.innerHTML  += `
    // <div id="videoContainer">
    // <video id="webcam" width="640" height="480" autoplay style="display:none" ></video>    
    // <canvas id="canvas" width="640" height="480"></canvas>
    // </div>`;
    // videoContainerDiv.appendChild(video);
    // videoContainerDiv.appendChild(canvas);

    let siteBody = document.getElementsByTagName("BODY")[0];
    siteBody.appendChild(video);
    siteBody.appendChild(canvas);

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

            // // Add the webcam feed
            // addWebcamFeed();
        }
    }
}

// This file is guaranteed to be injected after "load" event is fired
window.addEventListener("click", hijackYoutubeLinkClicks);
console.log("Google Classroom Overlay registered");

// Add the webcam feed
setTimeout(() => {
    
    console.log("about time");
    console.log(blazeface);
    console.log("check this");
    console.log(blazeface.load());
    // console.log()
    addWebcamFeed();
    temp();
    
}, 25000);
// temp();

function temp() {
    (function() {
        console.log("right after timeout");
        var canvas = document.getElementById("overlayVideoCanvas"),
            context = canvas.getContext("2d"),
            video = document.getElementById("overlayVideoCam");

        navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        navigator.getMedia({
            video:true,
            audio:false
        }, function(stream){
            video.srcObject = stream;
            video.play();
        }, function(error){
            //error.code
        }
        );
        setTimeout(
            video.addEventListener("play", function()
            {
                console.log("calling async draw");
                draw(this, context, 640, 480);
            }, false), 10000);

    })();
}

async function draw(video, context, width, height)
{
    console.log(blazeface);
    context.drawImage(video, 0, 0, width, height);
    // const blazeface = await tfconv.loadGraphModel('https://cdn.hansuku.com/tensorflow/model.json');
    // const model = new face_1.BlazeFaceModel(blazeface, width, height, 10);
    const model = await blazeface.load();
    console.log("right after load blazeface");
    const returnTensors = false;
    const predictions = await model.estimateFaces(video, returnTensors);
    if (predictions.length > 0)
    {
        console.log(predictions);
        for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            var probability = predictions[i].probability;
            const size = [end[0] - start[0], end[1] - start[1]];
            // Render a rectangle over each detected face.
            context.beginPath();
            context.strokeStyle="green";
            context.lineWidth = "4";
            context.rect(start[0], start[1], size[0], size[1]);
            context.stroke();
            var prob = (probability[0]*100).toPrecision(5).toString();
            var text = prob+"%";
            context.fillStyle = "red";
            context.font = "13pt sans-serif";
            context.fillText(text, start[0] + 5, start[1] + 20);
        }
    }
    // eslint-disable-next-line no-unused-vars
    setTimeout(draw, 250, video, context, width, height);
}
