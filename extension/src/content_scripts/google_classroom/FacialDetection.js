import { GVars } from "./GlobalVariablesAndConstants.js";

async function settingUpModel() {
    await tf.wasm.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm"); 
    await tf.setBackend("wasm"); 
    GVars.model = await blazeface.load(); 
    console.log("Finished loading model");
}

export { settingUpModel };
