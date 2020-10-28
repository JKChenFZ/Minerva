import express from "express";
import { getAllKeys, rpushAsync } from "../utils/Redis.js";
const router = express.Router();

// Add question timestamp based on given video ID
router.post("/addQuestion", async function (req, res) {
    let status = true;
    try {
        if (!req.body.videoID || 
            !req.body.timestamp || 
            !req.body.type) {
            throw new Error("Incomplete parameters");
        }

        let key = `${req.body.videoID}-${req.body.type}`;
        let val = `${req.body.timestamp}`;
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

    try {
        if (!req.query.videoID) {
            throw new Error("Incomplete parameters");
        }

        let activeQuestionKey = `${req.query.videoID}-active`;
        let passiveQUestionKey = `${req.query.videoID}-passive`;
        activeQuestions = await getAllKeys(activeQuestionKey, 0, -1);
        passiveQuestions = await getAllKeys(passiveQUestionKey, 0, -1);
    } catch (e) {
        console.error(`[Endpoint] getAllQuestions failed, ${e}`);
        status = false;
    }

    res.json({status, activeQuestions, passiveQuestions});
});

export { router as VideoRouter };
