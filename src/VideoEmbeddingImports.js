// function importTFJS() {
//   // Add the tensorflow.js 
//   // let tfjs = document.createElement('script');
//   // tfjs.rel = 'tfjs';
//   // tfjs.type = 'text/javascript';
//   // tfjs.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
//   // (document.head||document.documentElement).appendChild(tfjs);
//   var scr  = document.createElement('script'),
//   head = document.head || document.getElementsByTagName('head')[0];
//   head.insertBefore(scr, head.firstChild);
  
//   // scr.setAttribute("src","script.js");
//   scr.onload = function(){
//     console.log('import tfjs Done');
//   }
//   scr.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
//   scr.async = false; // optionally
//   console.log("Import tfjs");
// }
// function importBlazeface() {
//   // Add the tensorflow.js 
//   // let tfjs = document.createElement('script');
//   // tfjs.rel = 'tfjs';
//   // tfjs.type = 'text/javascript';
//   // tfjs.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
//   // (document.head||document.documentElement).appendChild(tfjs);
//   var scr  = document.createElement('script'),
//   head = document.head || document.getElementsByTagName('head')[0];
//   head.insertBefore(scr, head.firstChild);
  
//   // scr.setAttribute("src","script.js");
//   scr.onload = function(){
//     console.log('import blazeface Done');
//   }
//   scr.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface';
//   scr.async = false; // optionally
//   console.log("Import tfjs");
// }

// // function importFacialDetectionModel() {
// //   // Add the blazeface
// //   // let bf = document.createElement('script');
// //   // // bf.rel = 'blazeface';
// //   // bf.type = 'text/javascript';
// //   // bf.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface';
// //   // (document.head||document.documentElement).appendChild(bf);
// //   var scr  = document.createElement('script'),
// //     head = document.head || document.getElementsByTagName('head')[0];
// //     head.insertBefore(scr, head.firstChild);
    
// //     // scr.setAttribute("src","script.js");
// //     scr.addEventListener('load', function(e) {
// //       console.log("Importing blazeface");
// //       console.log(blazeface);
// //       let videoEmbedDiv = document.createElement('div');
// //       videoEmbedDiv.id = "videoCameraEmbedding";
// //       // videoEmbedDiv.innerHTML +=  `<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>`;
// //       // videoEmbedDiv.innerHTML +=  `<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface"></script>`;
      
// //       // Embed the webcam
// //       videoEmbedDiv.innerHTML  += `<div class="blur">
// //       <h2 id="heading"> Face detection using Tensorflow.js</h3>
// //       <div id="videoContainer">
// //       <video id="webcam" width="640" height="480" autoplay style="display:none" ></video>    
// //       <canvas id="canvas" width="640" height="480"></canvas>
// //       </div>`;
    
// //       // videoEmbedDiv.innerHTML  += `<script src ="facialDetection.js" type="text/javascript"></script>`;
// //       let siteBody = document.getElementsByTagName("BODY")[0];
// //       siteBody.appendChild(videoEmbedDiv);
// //       (function() {
// //           console.log('right after timeout');
// //           var canvas = document.getElementById('canvas'),
// //               context = canvas.getContext('2d'),
// //               video = document.getElementById('webcam');
          
// //           navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
          
// //           navigator.getMedia({
// //               video:true,
// //               audio:false
// //           }, function(stream){
// //               video.srcObject = stream;
// //               video.play();
// //           }, function(error){
// //               //error.code
// //           }
// //           );
// //           setTimeout(
// //           video.addEventListener('play',function()
// //                                 {
// //               console.log("calling async draw");
// //               draw(this, context,640,480);
// //           },false), 10000);
          
// //         })();
// //     });
// //     scr.async = false; // optionally
// //     scr.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface';

  
  
// // }


// // async function draw(video,context, width, height)
// // {
// //   context.drawImage(video,0,0,width,height);
// //   const model = await blazeface.load();
// //   console.log('right after load blazeface');
// //   const returnTensors = false;
// //   const predictions = await model.estimateFaces(video, returnTensors);
// //     if (predictions.length > 0)
// //     {
// //      console.log(predictions);
// //      for (let i = 0; i < predictions.length; i++) {
// //      const start = predictions[i].topLeft;
// //      const end = predictions[i].bottomRight;
// //      var probability = predictions[i].probability;
// //      const size = [end[0] - start[0], end[1] - start[1]];
// //      // Render a rectangle over each detected face.
// //      context.beginPath();
// //      context.strokeStyle="green";
// //      context.lineWidth = "4";
// //      context.rect(start[0], start[1],size[0], size[1]);
// //      context.stroke();
// //      var prob = (probability[0]*100).toPrecision(5).toString();
// //      var text = prob+"%";
// //      context.fillStyle = "red";
// //      context.font = "13pt sans-serif";
// //      context.fillText(text,start[0]+5,start[1]+20);
// //       }
// //      }
// //   setTimeout(draw,250,video,context,width,height);
// // }

// function injectJS(src, inline) {
//   var script = document.createElement("script");
//   script.onload = function() {    
//   console.log("Importing blazeface");
//   console.log(blazeface);};
//   script.onerror = function() {console.log("Error!");};
//   if (inline) {
//     script.innerHTML = src;
//     script.onload();
//   } else {
//     script.src = src;
//   }
//   document.body.appendChild(script);
// }
// injectJS("https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface", true);



// window.addEventListener('load', importTFJS);
// window.addEventListener('load', importBlazeface);
