import { GVars } from "./GlobalVariablesAndConstants.js";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";

const WASM_PATH = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm";

async function renderPrediction() {
    if(!GVars.video)  {
        return;
    }
    const returnTensors = false;
    const annotateBoxes = true;
    const predictions = await GVars.model.estimateFaces(
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
            GVars.ctx.strokeRect(start[0], start[1], size[0], size[1]);
  
            if (annotateBoxes) {
                const landmarks = predictions[i].landmarks;
                GVars.ctx.fillStyle = "white";
                for (let j = 0; j < landmarks.length; j++) {
                    const x = landmarks[j][0];
                    const y = landmarks[j][1];
                    GVars.ctx.fillRect(x, y, 5, 5);
                }
            }
        }
    }

    requestAnimationFrame(renderPrediction);
};

async function settingUpModel() {
    await tf.wasm.setWasmPath(WASM_PATH); 
    await tf.setBackend("wasm"); 
    GVars.model = await blazeface.load(); 
    console.log("Finished loading model");
}

export { renderPrediction, settingUpModel };
