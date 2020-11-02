import { addActiveQuestion } from "../utils/ApiInterface.js";

async function handleAddActiveQuestion(request, reply) {
    let result = await addActiveQuestion(
        request.videoID,
        request.timestamp,
        request.questionText
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
        if (request.type == "AddActiveQuestion") {
            handleAddActiveQuestion(request, sendResponse);
        } else {
            sendResponse({ status: false });
        }

        return true;
    }
);
