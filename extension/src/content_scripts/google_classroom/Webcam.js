import { GVars } from "./GlobalVariablesAndConstants.js";

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
    GVars.video = document.getElementById("overlayVideoCam");
  
    GVars.stream = await navigator.mediaDevices.getUserMedia({
        "audio": false,
        "video": { facingMode: "user" },
    });
    GVars.video.srcObject = GVars.stream;
  
    return new Promise((resolve) => {
        GVars.video.onloadedmetadata = () => {
            resolve(GVars.video);
        };
    });
}

async function integrateWebcam() {
    setupWebcam();
    await enableCamera();

    // canvas = document.getElementById("overlayVideoCanvas");
    // ctx = canvas.getContext("2d");
    // ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

    // renderPrediction();
}

export { integrateWebcam };
