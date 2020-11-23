import { GVars } from "./GlobalVariablesAndConstants.js";
import { setWasmPaths } from "@tensorflow/tfjs-backend-wasm";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

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
            
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];

            GVars.ctx.strokeStyle = "white";
            GVars.ctx.strokeRect(start[0] - 5, start[1] - 1, size[0] + 10, size[1] + 10);
  
            if (annotateBoxes) {
                const landmarks = predictions[i].landmarks;
                GVars.ctx.fillStyle = "white";
                for (let j = 0; j < landmarks.length; j++) {
                    const x = landmarks[j][0];
                    const y = landmarks[j][1];
                    GVars.ctx.fillRect(x, y, 5, 5);
                }
            }
            
            // get crop face
            // const face = GVars.ctx.getImageData(start[0] - 5, start[1] - 5, size[0] + 10, size[1] + 10);
            // console.log(face);
            const faceInput = tf.browser.fromPixels(GVars.video, 3)
                .resizeBilinear([150, 150]) 
                .expandDims(0);   
            // console.log(faceInput.dataSync());
            const input = tf.tensor4d(Array.from(faceInput.dataSync()), [1, 150, 150, 3]);
            // console.log(input.dataSync());
            console.log(input.shape);
            // preprocessing grayscale
            const r = input.slice([0, 0, 0, 0], [1, input.shape[1], input.shape[2], 1]);
            const g = input.slice([0, 0, 0, 1], [1, input.shape[1], input.shape[2], 1]);
            const b = input.slice([0, 0, 0, 2], [1, input.shape[1], input.shape[2], 1]);
            const avg = tf.div(tf.addN([r, g, b]), tf.tensor([3]));
            const grayInput = tf.concat([avg, avg, avg], 3);
            console.log(grayInput.shape);
            // const img = document.createElement("img");
            // // img.src = grayInput.toDataURL("image/png");
            // // document.body.appendChild(img);

            // // get expression prediciton
            let prediction = await GVars.facialExpressionModel.predict(grayInput);
            console.log(prediction.dataSync());
            let label = prediction.dataSync() < .5 ? true : false;
            console.log(label);

            // TODO: send passive signal to backend
            // remember to add time check so it doesnt overflow the backend
            
        }
    }

    requestAnimationFrame(renderPrediction);
};

async function settingUpModel() {
    setWasmPaths(WASM_PATH);
    await tf.setBackend("wasm"); 
    GVars.facialDetectionModel = await blazeface.load(); 
    GVars.facialExpressionModel = await tf.loadGraphModel(chrome.runtime.getURL("json/model.json"));
    console.log("Finished loading model");
}

export { renderPrediction, settingUpModel };
