// import tfjs from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"
// import blazeface  from "https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface"

const EXIT_BUTTON_SVG = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg>';

function exitButtonOnclick(e) {
    if (e.target.nodeName != "path" && e.target.nodeName != "svg") {
        return;
    }

    let overlay = document.getElementById("studyModeLocker");
    if (overlay) {
        overlay.remove();
        // Add the handler back
        window.addEventListener('click', hijackYoutubeLinkClicks);
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
            window.removeEventListener('click', hijackYoutubeLinkClicks);

            // Overlay
            let overlay = document.createElement('div');
            overlay.id = "studyModeLocker";

            // Add overlay to the body
            let siteBody = document.getElementsByTagName("BODY")[0];
            siteBody.appendChild(overlay);

            // Embed the exit button
            let exitButton = document.createElement('div');
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

function embedVideoCam(e) {
    let videoEmbedDiv = document.createElement('div');
    videoEmbedDiv.id = "videoCameraEmbedding";
    // Embed the webcam
    videoEmbedDiv.innerHTML  += `<div class="blur">
    <h2 id="heading"> Face detection using Tensorflow.js</h3>
    <div id="videoContainer">
    <video id="webcam" width="640" height="480" autoplay style="display:none" ></video>    
    <canvas id="canvas" width="640" height="480"></canvas>
    </div>`;
    let siteBody = document.getElementsByTagName("BODY")[0];
    siteBody.appendChild(videoEmbedDiv);
    
    (function() {
        console.log('right after timeout');
        var canvas = document.getElementById('canvas'),
            context = canvas.getContext('2d'),
            video = document.getElementById('webcam');
        
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
        video.addEventListener('play',function()
                              {
            console.log("calling async draw");
            draw(this, context,640,480);
        },false), 10000);
        
      })();
}
async function draw(video,context, width, height)
{
    context.drawImage(video,0,0,width,height);
    const model = await blazeface.load();
    console.log('right after load blazeface');
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
       context.rect(start[0], start[1],size[0], size[1]);
       context.stroke();
       var prob = (probability[0]*100).toPrecision(5).toString();
       var text = prob+"%";
       context.fillStyle = "red";
       context.font = "13pt sans-serif";
       context.fillText(text,start[0]+5,start[1]+20);
        }
       }
    setTimeout(draw,250,video,context,width,height);
}
window.addEventListener("load", function (e) {
    window.addEventListener("click", hijackYoutubeLinkClicks);
    console.log("Google Classroom Handler registered");
});

window.addEventListener("load", function (e) {
    window.addEventListener("click", embedVideoCam);
    console.log("Google Classroom Camera Handler registered");
});

