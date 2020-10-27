import express from "express";

const router = express.Router();

// Add active question timestamp based on given video ID
router.put("/addActiveQuestion", function (req, res) {
    // TODO
    res.send("Works");
});

export { router as VideoRouter };
