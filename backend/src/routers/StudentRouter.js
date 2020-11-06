import express from "express";
import {
    client,
    incrAsync,
    incrByAsync,
    keysAsync,
    lrangeAsync,
    mgetAsync,
    watchAsync
} from "../utils/Redis.js";
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
    let timeRecord = null;
    let coinBalance = null;
    let correctCount = -1;
    let incorrectCount = -1;
    let ownedBadges = [];

    try {
        if (isNullOrUndefined(studentName)) {
            throw new Error("Incomplete parameters");
        }

        let keys = [
            `${studentName}-time`,
            `${studentName}-balance`,
            `${studentName}-correct-question-count`,
            `${studentName}-incorrect-question-count`
        ];

        let result = await mgetAsync(keys);
        timeRecord = parseInt(result[0]);
        coinBalance = parseInt(result[1]);
        correctCount = parseInt(result[2]);
        incorrectCount = parseInt(result[3]);

        let badgeKey = `${studentName}-owned-badges`;
        ownedBadges = await lrangeAsync(badgeKey, 0, -1);
    } catch (e) {
        console.error(`[Endpoint] getStudentBalance failed, ${e}`);
        status = false;
    }

    res.json({
        status,
        "time_record": timeRecord,
        "coin_balance": coinBalance,
        "correct_count": correctCount,
        "incorrect_count": incorrectCount,
        "owned_badges": ownedBadges
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

router.post("/purchaseSticker", async function (req, res) {
    let status = true;
    let studentName = req.body["student_name"];
    let stickerName = req.body["sticker_name"];
    let price = req.body["price"];

    try {
        if (includesNullOrUndefined([studentName, stickerName, price])) {
            throw new Error("Incomplete parameters");
        }
        
        let studentBalanceKey = `${studentName}-balance`;
        let studentStickerKey = `${studentName}-owned-badges`;
        // Start a transaction
        await watchAsync(studentBalanceKey, studentStickerKey);
        let balance = await mgetAsync(studentBalanceKey);
        let ownedStickers = await lrangeAsync(studentStickerKey, 0, -1);

        // Check for the conditions
        if (balance[0] < price || ownedStickers.includes(stickerName)) {
            throw new Error("Insufficient balance or duplicate sticker");
        }

        let result = await new Promise((resolve, reject) => {
            client.multi()
                .decrby(studentBalanceKey, price)
                .rpush(studentStickerKey, stickerName)
                .exec((error, reply) => {
                    if (error || !reply) {
                        reject(error);
                    }

                    resolve(reply);
                });
        });

        console.log("[Endpoint] purchaseSticker executed with following output");
        console.log(result);
    } catch (e) {
        console.error(`[Endpoint] purchaseSticker failed, ${e}`);
        status = false;
    }

    res.json({ status });
});

router.post("/answerQuestionCorrect", async function (req, res) {
    let status = true;
    let studentName = req.body["student_name"];

    try {
        if (isNullOrUndefined(studentName)) {
            throw new Error("Incomplete parameters");
        }

        let key = `${studentName}-correct-question-count`;
        await incrAsync(key);
    } catch (e) {
        console.error(`[Endpoint] answerQuestionCorrect failed, ${e}`);
        status = false;
    }

    res.json({ status });
});

router.post("/answerQuestionIncorrect", async function (req, res) {
    let status = true;
    let studentName = req.body["student_name"];

    try {
        if (isNullOrUndefined(studentName)) {
            throw new Error("Incomplete parameters");
        }

        let key = `${studentName}-incorrect-question-count`;
        await incrAsync(key);
    } catch (e) {
        console.error(`[Endpoint] answerQuestionIncorrect failed, ${e}`);
        status = false;
    }

    res.json({ status });
});

export { router as StudentRouter };
