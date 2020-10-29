import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { StudentRouter } from "./src/routers/StudentRouter.js";
import { VideoRouter } from "./src/routers/VideoRouter.js";

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// CORS setting
app.use(cors());

app.use("/video", VideoRouter);
app.use("/student", StudentRouter);

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: true }));
});

app.listen(port, () => {
    console.log(`Minerva backend is active at http://localhost:${port}`);
});
