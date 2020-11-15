import {
    addActiveQuestion,
    answerQuestionCorrectly,
    answerQuestionIncorrectly,
    fetchCurrentStudentInfo,
    fetchStudentRankings,
    fetchVideos,
    fetchVideoFeedback,
    finishVideo,
    getPostLectureQuestion,
    getStudentFreeHours,
    getStudentHandle,
    saveVideoInfo,
    setNewFreeHours
} from "../utils/ApiInterface.js";

async function handleAddActiveQuestion(request, reply) {
    let result = await addActiveQuestion(
        request.videoID,
        request.timestamp,
        request.questionText
    );

    reply(result);
}

async function handleAnswerQuestionCorrectly(request, reply) {
    let result = await answerQuestionCorrectly(
        request.videoID
    );

    reply(result);
}

async function handleAnswerQuestionIncorrectly(request, reply) {
    let result = await answerQuestionIncorrectly();

    reply(result);
}

async function handleFetchCurrentStudentInfo(request, reply) {
    let result = await fetchCurrentStudentInfo(
        request.studentName
    );

    reply(result);
}

async function handleFetchStudentRankings(request, reply) {
    let result = await fetchStudentRankings();

    reply(result);
}

async function handleFetchVideos(reply) {
    let result = await fetchVideos();

    reply(result);
}

async function handleFetchVideoFeedback(request, reply) {
    let result = await fetchVideoFeedback(
        request.videoID
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

async function handleGetPostLectureQuestions(request, reply) {
    let result = await getPostLectureQuestion(
        request.videoID
    );

    reply(result);
}
async function handleGetStudentFreeHours(reply) {
    let result = await getStudentFreeHours();

    reply(result);
}

async function handleGetStudentName(reply) {
    let status = true;
    let name = null;

    try {
        name = await getStudentHandle();
    } catch (e) {
        status = false;
    }

    reply({
        status,
        name
    });
}

function handleMuteCurrentTab() {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { "muted": true });
    });
}

async function handleSaveVideoInfo(request, reply) {
    let result = await saveVideoInfo(
        request.videoID,
        request.videoName,
        request.videoDuration
    );

    reply(result);
}

async function handleSetNewFreeHours(request, reply) {
    let result = await setNewFreeHours(
        request.hourStart,
        request.hourEnd
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
        case "AnswerQuestionCorrectly":
            handleAnswerQuestionCorrectly(request, sendResponse);
            break;
        case "AnswerQuestionIncorrectly":
            handleAnswerQuestionIncorrectly(request, sendResponse);
            break;
        case "FetchCurrentStudentInfo":
            handleFetchCurrentStudentInfo(request, sendResponse);
            break
        case "FetchStudentRankings":
            handleFetchStudentRankings(request, sendResponse);
            break;
        case "FetchVideos":
            handleFetchVideos(sendResponse);
            break;
        case "FetchVideoFeedback":
            handleFetchVideoFeedback(request, sendResponse);
            break;
        case "FinishVideo":
            handleFinishVideo(request, sendResponse);
            break;
        case "GetPostLectureQuestions":
            handleGetPostLectureQuestions(request, sendResponse);
            break;
        case "GetStudentFreeHours":
            handleGetStudentFreeHours(sendResponse);
            break;
        case "GetStudentName":
            handleGetStudentName(sendResponse);
            break;
        case "MuteCurrentTab":
            handleMuteCurrentTab();
            sendResponse({ status: true });
        case "SaveVideoInfo":
            handleSaveVideoInfo(request, sendResponse);
            break;
        case "SetNewFreeHours":
            handleSetNewFreeHours(request, sendResponse);
            break;
        default:
            sendResponse({ status: false });
            break;
        }

        return true;
    }
);
