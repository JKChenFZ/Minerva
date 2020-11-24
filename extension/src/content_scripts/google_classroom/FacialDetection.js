import { GVars, CONSTANTS } from "./GlobalVariablesAndConstants.js";
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
// import LeakyBucket from "leaky-bucket";


const WASM_PATH = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/";

async function renderPrediction() {
    if(!GVars.video)  {
        return;
    }
    const returnTensors = false;
    const annotateBoxes = true;
    const predictions = await GVars.facialDetectionModel.estimateFaces(
        GVars.video, returnTensors);
    console.debug("sending message to workier");
    GVars.emotionDetectionWorker.postMessage([predictions]);

    requestAnimationFrame(renderPrediction);
};

async function settingUpModel() {
    setWasmPaths(WASM_PATH);
    await tf.setBackend("wasm"); 
    GVars.facialDetectionModel = await blazeface.load(); 
    GVars.facialExpressionModel = await tf.loadGraphModel(chrome.runtime.getURL("json/model.json"));
    // GVars.postPassiveQuestionLeakyBucket = new Bucket({
    //     capacity: 60,
    //     interval: 60,
    // });
    console.log("Finished loading model");
    GVars.emotionDetectionWorker = new Worker('EmotionDetection.js');
}

export { renderPrediction, settingUpModel };
