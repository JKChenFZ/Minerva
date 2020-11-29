import { GVars, CONSTANTS } from "./GlobalVariablesAndConstants.js";
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import { LeakyBucket, LeakyBucketOptions } from "ts-leaky-bucket";

const WASM_PATH = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/";

async function renderPrediction() {
    if(!GVars.video)  {
        return;
    }
    const returnTensors = false;
    const annotateBoxes = true;
    const predictions = await GVars.facialDetectionModel.estimateFaces(
        GVars.video, returnTensors);

    if (predictions.length > 0) {
        GVars.ctx.clearRect(0, 0, GVars.canvas.width, GVars.canvas.height);
  
        for (let i = 0; i < predictions.length; i++) {
            if (returnTensors) {
                console.log(predictions[i].topLeft.arraySync());
                
                predictions[i].topLeft = predictions[i].topLeft.arraySync();
                predictions[i].bottomRight = predictions[i].bottomRight.arraySync();
                if (annotateBoxes) {
                    predictions[i].landmarks = predictions[i].landmarks.arraySync();
                }
            }

            // Convert Image to tensor
            const faceInput = tf.browser.fromPixels(GVars.video, 3)
                .expandDims(0);   
            const input = tf.tensor4d(Array.from(faceInput.dataSync()), [1, faceInput.shape[1], faceInput.shape[2], 3]);

            // crop face based on facial detection results
            const normalizeStart = tf.div(predictions[i].topLeft, input.shape.slice([1], [2]));
            const normalizeEnd = tf.div(predictions[i].bottomRight, input.shape.slice([1], [2]));
            const boxes = tf.concat([normalizeStart, normalizeEnd]).reshape([-1, 4]);
            const cropFace = tf.image.cropAndResize(faceInput, boxes, [0], [150, 150]);

            // preprocessing grayscale
            const r = cropFace.slice([0, 0, 0, 0], [1, cropFace.shape[1], cropFace.shape[2], 1]);
            const b = cropFace.slice([0, 0, 0, 1], [1, cropFace.shape[1], cropFace.shape[2], 1]);
            const g = cropFace.slice([0, 0, 0, 2], [1, cropFace.shape[1], cropFace.shape[2], 1]);
            const avg = tf.div(tf.addN([r, b, g]), tf.tensor([3]));
            const grayInput = tf.concat([avg, avg, avg], 3);
            
            // expression prediction
            let prediction = await GVars.facialExpressionModel.predict(grayInput);
            console.log(prediction.dataSync()[0]);
            let confidence = Math.abs(prediction.dataSync()[0] - .5) / .5;

            let confidenceLabel = confidence < .5 ? true : false;
            let label = prediction.dataSync()[0] < .5 ? true : false;
            console.log(label);

            if (label) {
                sendPassiveSignal();
            }
        }
    }

    requestAnimationFrame(renderPrediction);
};

async function sendPassiveSignal() {
    await GVars.postPassiveQuestionLeakyBucket.maybeThrottle();    
    let timestamp = GVars.player.getCurrentTime();
    let videoID = window.localStorage.getItem(CONSTANTS.YOUTUBE_VIDEO_ID);
    
    chrome.runtime.sendMessage({
        type: "AddNewPassiveQuestion",
        videoID: videoID,
        timestamp: timestamp
    });

}

async function settingUpModel() {
    setWasmPaths(WASM_PATH);
    await tf.setBackend("wasm"); 
    GVars.facialDetectionModel = await blazeface.load(); 
    GVars.facialExpressionModel = await tf.loadGraphModel(chrome.runtime.getURL("json/model.json"));
    GVars.postPassiveQuestionLeakyBucket = new LeakyBucket({
        capacity: 120,
        intervalMillis: 60_000,
        timeoutMillis: 300_000,
    });
    console.log("Finished loading model");
}

export { renderPrediction, settingUpModel };
