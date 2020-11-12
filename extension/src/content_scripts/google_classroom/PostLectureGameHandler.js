import Swal from "sweetalert2";
import { GVars } from "./GlobalVariablesAndConstants";

function handleMessages(event) {
    if (!event.origin.startsWith("chrome-extension://")) {
        // Only intercept messages from our iframe games
        return;
    }

    console.debug(event);
    let receivedData = event.data;

    // Remove game iframe
    GVars.gameIframe.parentNode.removeChild(GVars.gameIframe);
    GVars.gameIframe = null;

    // Show the corresponding alert
    Swal.fire({
        icon: receivedData.correct ? "success" : "error"
    });
}

export { handleMessages };
