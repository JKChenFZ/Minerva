import express from "express";
import { incrByAsync, mgetAsync } from "../utils/Redis.js";

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

    try {
        if (!studentName || !newIncrement) {
            throw new Error("Incomplete parameters");
        }

        let balanceKey = `${studentName}-balance`;
        let timeKey = `${studentName}-time`;
        newBalance = await incrByAsync(balanceKey, newIncrement);
        newTime = await incrByAsync(timeKey, newIncrement);
    } catch (e) {
        console.error(`[Endpoint] addStudentBalance failed, ${e}`);
        status = false;
    }

    res.json({status, newBalance, newTime});
});

export { router as StudentRouter };
