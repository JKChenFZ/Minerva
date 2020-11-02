import express from "express";
import { getAllKeys, incrAsync, rpushAsync } from "../utils/Redis.js";
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
    let passiveQuestions = [];
    let videoID = req.query.videoID; 

    try {
        if (isNullOrUndefined(videoID)) {
            throw new Error("Incomplete parameters");
        }

        let activeQuestionKey = `${videoID}-active`;
        let passiveQUestionKey = `${videoID}-passive`;
        activeQuestions = await getAllKeys(activeQuestionKey, 0, -1);
        passiveQuestions = await getAllKeys(passiveQUestionKey, 0, -1);
    } catch (e) {
        console.error(`[Endpoint] getAllQuestions failed, ${e}`);
        status = false;
    }

    res.json({status, activeQuestions, passiveQuestions});
});

export { router as VideoRouter };
