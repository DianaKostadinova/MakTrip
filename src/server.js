const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/deezer", async (req, res) => {
    try {
        const response = await fetch("http://api.deezer.com/chart/0/tracks", {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("❌ FETCH ERROR:", err);
        res.status(500).json({
            error: "Failed to fetch from Deezer",
            message: err.message,
            stack: err.stack
        });
    }
});

app.listen(4000, () => {
    console.log("✅ Proxy running at http://localhost:4000");
});
