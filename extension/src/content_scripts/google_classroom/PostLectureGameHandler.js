import { GVars } from "./GlobalVariablesAndConstants";

function handleMessages(event) {
    if (!event.origin.startsWith("chrome-extension://")) {
        // Only intercept messages from our iframe games
        return;
    }

    // Remove game iframe
    GVars.gameIframe.parentNode.removeChild(GVars.gameIframe);
    GVars.gameIframe = null;
    console.log("Successfully closed the game iframe");
}

export { handleMessages };
