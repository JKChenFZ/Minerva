const API_HOST = "localhost:3000";
const GET_REQUEST = "GET";
const POST_REQUEST = "POST";
const STUDENT_NAME = "student_name";
const stickers = [ 
    {
        id: "golden_star", 
        price: 5000000,
        name: "Gold Star"
    }, 
    { 
        id: "pencil",
        price: 2000000,
        name: "Cool Pencil"
    }, 
    {   
        id: "ruler",
        price: 1000000,
        name: "New Ruler"
    }
];

function getBaselineFetchOptions() {
    return {
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        }
    };
}

function getStickers() {
    return stickers;
}

function getStudentHandle() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(STUDENT_NAME, (result) => {
            if (result[STUDENT_NAME]) {
                resolve(result[STUDENT_NAME]);
            } else {
                console.error(result);
                reject("Name retrieval failed");
            }
        });
    });
}

async function addActiveQuestion(videoID, timestamp, questionText) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;

    try {
        let studentHandle = await getStudentHandle();
        requestOption.body = JSON.stringify({
            "student_name": studentHandle,
            "videoID": videoID,
            "timestamp": timestamp,
            "question_text": questionText
        });
        let result = await fetch(`http://${API_HOST}/video/addActiveQuestion`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function addNewVideoQuestion(videoID, question, correct, wrong, anotherWrong) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;

    try {
        requestOption.body = JSON.stringify({
            "videoID": videoID,
            question,
            correct,
            wrong,
            "another_wrong": anotherWrong
        });
        let result = await fetch(`http://${API_HOST}/video/AddPostLectureQuestions`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function answerQuestionCorrectly(videoID) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;

    try {
        let studentHandle = await getStudentHandle();
        requestOption.body = JSON.stringify({
            "student_name": studentHandle,
            "videoID": videoID
        });
        let result = await fetch(`http://${API_HOST}/student/answerQuestionCorrect`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function answerQuestionIncorrectly() {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;

    try {
        let studentHandle = await getStudentHandle();
        requestOption.body = JSON.stringify({
            "student_name": studentHandle
        });
        let result = await fetch(`http://${API_HOST}/student/answerQuestionIncorrect`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function buySticker(stickerID, stickerPrice) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;
    
    try {
        let studentHandle = await getStudentHandle();
        requestOption.body = JSON.stringify({
                "student_name": studentHandle,
                "sticker_name": stickerID,
                "price": stickerPrice,
        });
        let result = await fetch(`http://${API_HOST}/student/purchaseSticker`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function fetchCurrentStudentInfo() {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = GET_REQUEST;

    try {
        let studentHandle = await getStudentHandle();
        let result = await fetch(`http://${API_HOST}/student/getStudentProfile?student_name=${studentHandle}`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function fetchStudentRankings() {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = GET_REQUEST;

    try {
        let result = await fetch(`http://${API_HOST}/student/getAllStudentTime`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function fetchVideos() {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = GET_REQUEST;

    try {
        let result = await fetch(`http://${API_HOST}/video/getAllVideoInfo`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function fetchVideoFeedback(videoID) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = GET_REQUEST;

    try {
        let result = await fetch(`http://${API_HOST}/video/getAllQuestions?videoID=${videoID}`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function finishVideo(videoID, increment) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;

    try {
        let studentHandle = await getStudentHandle();
        requestOption.body = JSON.stringify({
            "student_name": studentHandle,
            "videoID": videoID,
            "increment": increment,
        });
        let result = await fetch(`http://${API_HOST}/student/finishVideo`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function getPostLectureQuestion(videoID) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = GET_REQUEST;

    try {
        let result = await fetch(
            `http://${API_HOST}/video/getPostLectureQuestions?videoID=${videoID}`,
            requestOption
        );
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function getStudentFreeHours() {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = GET_REQUEST;

    try {
        let studentHandle = await getStudentHandle();
        let result = await fetch(
            `http://${API_HOST}/student/getStudentFreeHours?student_name=${studentHandle}`,
            requestOption
        );
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function saveVideoInfo(videoID, videoName, videoDuration) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;

    try {
        requestOption.body = JSON.stringify({
            "videoID": videoID,
            "video_name": videoName,
            "video_duration": videoDuration // Integer Type
        });
        let result = await fetch(`http://${API_HOST}/video/saveVideoInfo`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

async function setNewFreeHours(hourStart, hourEnd) {
    let requestOption = getBaselineFetchOptions();
    requestOption.method = POST_REQUEST;

    try {
        let studentHandle = await getStudentHandle();
        requestOption.body = JSON.stringify({
            "student_name": studentHandle,
            "hour_start": hourStart, // Integer Type
            "hour_end": hourEnd // Integer Type
        });
        let result = await fetch(`http://${API_HOST}/student/saveStudentFreeHours`, requestOption);
        let parsed = await result.json();

        return parsed;
    } catch (e) {
        console.error(e);

        return { status: false };
    }
}

export {
    addActiveQuestion,
    addNewVideoQuestion,
    answerQuestionCorrectly,
    answerQuestionIncorrectly,
    buySticker,
    fetchCurrentStudentInfo,
    fetchStudentRankings,
    fetchVideos,
    fetchVideoFeedback,
    finishVideo,
    getPostLectureQuestion,
    getStickers,
    getStudentFreeHours,
    getStudentHandle,
    saveVideoInfo,
    setNewFreeHours
};
