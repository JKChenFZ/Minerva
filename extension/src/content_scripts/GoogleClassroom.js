const GOOGLE_CLASSROOM_OVERLAY_SCRIPT = "src/embed_scripts/GoogleClassroomOverlay.js";
const FONT_AWESOME_URL = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css";
const IFRAME_API = "https://www.youtube.com/iframe_api";

// Snackbar source
const SNACKBAR_JS = "https://cdnjs.cloudflare.com/ajax/libs/node-snackbar/0.1.16/snackbar.min.js";
const SNACKBAR_CSS = "https://cdnjs.cloudflare.com/ajax/libs/node-snackbar/0.1.16/snackbar.css";

// Webcam vendor scripts
const TFJS = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";
const BLAZE_FACE = "https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface";
const TF_CONV = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter";
const TFJS_NODE = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-node";

function addScript(url) {
    let script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";

    (document.head || document.documentElement).appendChild(script);
}

function addStyleSheet(url) {
    // Add the style sheet
    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = url;
    style.crossOrigin = "anonymous";

    (document.head||document.documentElement).appendChild(style);
    console.log(`Added stylesheet from ${url}`);
}

// This content script is guaranteed to fire after "load" event is fired
addStyleSheet(FONT_AWESOME_URL);
addStyleSheet(SNACKBAR_CSS);
addScript(SNACKBAR_JS);
addScript(chrome.runtime.getURL(GOOGLE_CLASSROOM_OVERLAY_SCRIPT));
addScript(IFRAME_API);
// addScript(TFJS_NODE);
// addScript(BLAZE_FACE);
// addScript(chrome.runtime.getURL("src/embed_scripts/blazeface.js"));
// addScript(chrome.runtime.getURL("src/embed_scripts/tfjs.js"));

addScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core");
addScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter");

addScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js");
addScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface");


addScript("https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js");
