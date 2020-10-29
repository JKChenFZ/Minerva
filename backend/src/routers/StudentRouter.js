import express from "express";
import { incrAsync, incrByAsync, mgetAsync } from "../utils/Redis.js";

const router = express.Router();

router.get("/getStudentBalance", async function (req, res) {
    let status = true;
    let balance = null;
    let studentName = req.query["student_name"];

    try {
        if (!studentName) {
            throw new Error("Incomplete parameters");
        }

        let key = `${studentName}-balance`;
        let result = await mgetAsync(key);
        balance = result[0];
    } catch (e) {
        console.error(`[Endpoint] getStudentBalance failed, ${e}`);
        status = false;
    }

    res.json({status, balance});
});

router.get("/getStudentTime", async function (req, res) {
    let status = true;
    let time = null;
    let studentName = req.query["student_name"];

    try {
        if (!studentName) {
            throw new Error("Incomplete parameters");
        }

        let key = `${studentName}-time`;
        let result = await mgetAsync(key);
        time = result[0];
    } catch (e) {
        console.error(`[Endpoint] getStudentTime failed, ${e}`);
        status = false;
    }

    res.json({status, time});
});

router.post("/finishVideo", async function (req, res) {
    let status = true;
    let newBalance = null;
    let newTime = null;
    let studentName = req.body["student_name"];
    let newIncrement = req.body["increment"];
    let videoID = req.body["videoID"];

    try {
        if (!studentName || !newIncrement || !videoID) {
            throw new Error("Incomplete parameters");
        }

        let watchTimesKey = `${videoID}-${studentName}-watch-times`;
        let newWatchTimes = await incrAsync(watchTimesKey);
        let discountedIncrement = Math.trunc(newIncrement / newWatchTimes);
        let balanceKey = `${studentName}-balance`;
        let timeKey = `${studentName}-time`;
        newBalance = await incrByAsync(balanceKey, discountedIncrement);
        newTime = await incrByAsync(timeKey, discountedIncrement);
    } catch (e) {
        console.error(`[Endpoint] addStudentBalance failed, ${e}`);
        status = false;
    }

    res.json({status, newBalance, newTime});
});

export { router as StudentRouter };
