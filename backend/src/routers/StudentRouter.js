import express from "express";
import { incrAsync, incrByAsync, keysAsync, mgetAsync } from "../utils/Redis.js";
import { isNullOrUndefined, includesNullOrUndefined } from "../utils/ValueChecker.js";

const router = express.Router();

router.get("/getAllStudentTime", async function (req, res) {
    let status = true;
    let studentInfo = null;

    try {
        let searchPattern = "*-time";
        let foundKeys = await keysAsync(searchPattern);
        let studentTimes = await mgetAsync(foundKeys);

        studentInfo = studentTimes.map((time, index) => {
            let correspondingKey = foundKeys[index];
            let name = correspondingKey.replace("-time", "");

            return {
                time,
                name
            };
        });
    } catch (e) {
        console.error(`[Endpoint] getAllStudentTime failed, ${e}`);
        status = false;
    }

    res.json({status, studentInfo});
});

router.get("/getStudentProfile", async function (req, res) {
    let status = true;
    let studentName = req.query["student_name"];
    let timeRecord = [null];
    let coinBalance = [null];

    try {
        if (isNullOrUndefined(studentName)) {
            throw new Error("Incomplete parameters");
        }

        let coinKey = `${studentName}-balance`;
        coinBalance = await mgetAsync(coinKey);

        let timeKey = `${studentName}-time`;
        timeRecord = await mgetAsync(timeKey);
    } catch (e) {
        console.error(`[Endpoint] getStudentBalance failed, ${e}`);
        status = false;
    }

    res.json({
        status,
        "time_record": timeRecord[0],
        "coin_balance": coinBalance[0]
    });
});

router.post("/finishVideo", async function (req, res) {
    let status = true;
    let newBalance = null;
    let newTime = null;
    let studentName = req.body["student_name"];
    let newIncrement = req.body["increment"];
    let videoID = req.body["videoID"];

    try {
        if (includesNullOrUndefined([studentName, newIncrement, videoID])) {
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
