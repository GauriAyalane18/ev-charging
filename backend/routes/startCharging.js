// routes/startCharging.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

router.post("/start", async (req, res) => {
    const { chargerId, label, timestamp } = req.body;

    try {
        const session = new Session({
            chargerId,
            label,
            startTime: timestamp,
            status: "pending"
        });

        await session.save();
        res.json({ success: true, sessionId: session._id });
    } catch (error) {
        console.error("Start Session Error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = router;
