import express from "express";
import { getAllKeys, rpushAsync } from "../utils/Redis.js";
import { isNullOrUndefined, includesNullOrUndefined } from "../utils/ValueChecker.js";
const router = express.Router();

// Add question timestamp based on given video ID
router.post("/addQuestion", async function (req, res) {
    let status = true;
    let videoID = req.body.videoID;
    let timestamp = req.body.timestamp;
    let type = req.body.type;
    try {
        if (includesNullOrUndefined([videoID, timestamp, type])) {
            throw new Error("Incomplete parameters");
        }

        let key = `${videoID}-${type}`;
        let val = `${timestamp}`;
        let result = await rpushAsync(key, val);
        console.log(`[Endpoint] Appended ${val} to ${key}, new length is ${result}`);
    } catch (e) {
        console.error(`[Endpoint] addActiveQuestion failed, ${e}`);
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
