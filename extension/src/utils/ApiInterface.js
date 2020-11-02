const API_HOST = "localhost:3000";
const POST_REQUEST = "POST";
const STUDENT_NAME = "student_name";

function getBaselineFetchOptions() {
    return {
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        }
    };
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

export { addActiveQuestion, finishVideo };