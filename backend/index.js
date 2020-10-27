import express from "express";
import { VideoRouter } from "./src/routers/VideoRouter.js";

const app = express();
const port = 3000;

app.use("/video", VideoRouter);

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: true }));
});

app.listen(port, () => {
    console.log(`Minerva backend is active at http://localhost:${port}`);
});
