import express from "express";
import { incrAsync, keysAsync, lrangeAsync, mgetAsync, rpushAsync } from "../utils/Redis.js";
import { isNullOrUndefined, includesNullOrUndefined } from "../utils/ValueChecker.js";
const router = express.Router();

// Add question timestamp based on given video ID
router.post("/addActiveQuestion", async function (req, res) {
    let status = true;
    let studentName = req.body.student_name;
    let videoID = req.body.videoID;
    let timestamp = req.body.timestamp;
    let questionText = req.body.question_text;

    try {
        if (includesNullOrUndefined([studentName, videoID, timestamp, questionText])) {
            throw new Error("Incomplete parameters");
        }

        let counterKey = `${videoID}-active-questions-${timestamp}`;
        let newCount = await incrAsync(counterKey);
        let questionKey = `${videoID}-active-questions-text`;
        let questionVal = `${studentName}-<>-${timestamp}-<>-${questionText}`;
        let result = await rpushAsync(questionKey, questionVal);
        console.log(`[Endpoint] incremented ${counterKey}, new length is ${newCount}`);
        console.log(`[Endpoint] Appended ${questionVal} to ${questionKey}, new length is ${result}`);
    } catch (e) {
        console.error(`[Endpoint] addActiveQuestion failed, ${e}`);
        status = false;
    }

    res.json({status});
});

router.post("/addPassiveQuestion", async function (req, res) {
    let status = true;
    let studentName = req.body.student_name;
    let videoID = req.body.videoID;
    let timestamp = req.body.timestamp;

    try {
        if (includesNullOrUndefined([studentName, videoID, timestamp])) {
            throw new Error("Incomplete parameters");
        }

        let counterKey = `${videoID}-passive-questions-${timestamp}`;
        let newCount = await incrAsync(counterKey);
        console.log(`[Endpoint] incremented ${counterKey}, new length is ${newCount}`);
    } catch (e) {
        console.error(`[Endpoint] addPassiveQuestion failed, ${e}`);
        status = false;
    }

    res.json({status});
});

// Get all timestamps associated with a video
router.get("/getAllQuestions", async function (req, res) {
    let status = true;
    let activeQuestions = [];
    let activeQuestionText = [];
    let passiveQuestions = [];
    let videoID = req.query.videoID; 

    try {
        if (isNullOrUndefined(videoID)) {
            throw new Error("Incomplete parameters");
        }

        // Grab all passive questions
        let passiveQuestionKeyPattern = `${videoID}-passive-questions-*`;
        let foundPassiveQuestionKeys = await keysAsync(passiveQuestionKeyPattern);
        let foundPassiveQuestionVals = await mgetAsync(foundPassiveQuestionKeys);

        passiveQuestions = foundPassiveQuestionKeys.map((key, index) => {
            let correspondingCounter = foundPassiveQuestionVals[index];
            let timestamp = key.replace(`${videoID}-passive-questions-`, "");

            return {
                timestamp,
                count: correspondingCounter
            };
        });

        // Grab all active questions
        let activeQuestionKeyPattern = `${videoID}-active-questions-*`;
        let foundActiveQuestionKeys = await keysAsync(activeQuestionKeyPattern);
        let foundActiveQuestionVals = await mgetAsync(foundActiveQuestionKeys);

        activeQuestions = foundActiveQuestionKeys.map((key, index) => {
            let correspondingCounter = foundActiveQuestionVals[index];
            let timestamp = key.replace(`${videoID}-active-questions-`, "");

            return {
                timestamp,
                count: correspondingCounter
            };
        });

        // Grab texual questions
        let activeTextQuestionKey = `${videoID}-active-questions-text`;
        let condensedQuestions = await lrangeAsync(activeTextQuestionKey, 0, -1);
        
        activeQuestionText = condensedQuestions.map((value) => {
            let splitted = value.split("-<>-");

            return {
                name: splitted[0],
                timestamp: splitted[1],
                text: splitted[2]
            };
        });
    } catch (e) {
        console.error(`[Endpoint] getAllQuestions failed, ${e}`);
        status = false;
    }

    res.json({
        status,
        "active_questions": activeQuestions,
        "active_questions_text": activeQuestionText,
        "passive_question": passiveQuestions
    });
});

export { router as VideoRouter };
