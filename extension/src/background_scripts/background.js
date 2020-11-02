import { addActiveQuestion, finishVideo } from "../utils/ApiInterface.js";

async function handleAddActiveQuestion(request, reply) {
    let result = await addActiveQuestion(
        request.videoID,
        request.timestamp,
        request.questionText
    );

    reply(result);
}

async function handleFinishVideo(request, reply) {
    let result = await finishVideo(
        request.videoID,
        request.increment
    );

    reply(result);
}

chrome.runtime.onInstalled.addListener(function() {
    // eslint-disable-next-line no-undefined
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher ({
                pageUrl: { hostEquals: "classroom.google.com"},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(`Received a message from ${sender.tab ? sender.tab.url : "extension"}`);
        switch (request.type) {
        case "AddActiveQuestion":
            handleAddActiveQuestion(request, sendResponse);
            break;
        case "FinishVideo":
            handleFinishVideo(request, sendResponse);
            break;
        default:
            sendResponse({ status: false });
            break;
        }

        return true;
    }
);
