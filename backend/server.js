require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
let Anthropic, client;
try {
  Anthropic = require("@anthropic-ai/sdk");
  if (process.env.ANTHROPIC_API_KEY) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
} catch (_) {}

const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

// Rule-based fallback when LLM is unavailable
function fallbackRecommendation({ temperature, humidity, ph, risk }) {
  const tips = [];
  if (humidity > 70) tips.push("Improve field drainage and reduce irrigation frequency to lower humidity.");
  if (temperature > 30) tips.push("Apply mulch to regulate soil temperature and reduce heat stress.");
  if (ph < 5.5) tips.push("Apply lime to raise soil pH toward the optimal 6.0–7.0 range.");
  if (ph > 7.5) tips.push("Add sulfur or organic matter to lower pH toward the optimal range.");
  if (risk > 60) tips.push("Inspect crops daily and apply a broad-spectrum fungicide as a preventive measure.");
  if (tips.length === 0) tips.push("Maintain current soil conditions and monitor crops weekly.");
  return tips.join(" ");
}

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// In-memory store (replace with MongoDB for persistence)
let predictions = [];

app.get("/", (req, res) => {
  res.send("AI Crop Disease Backend is Running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ==============================
// SOIL PREDICTION
// ==============================
app.post("/soil", async (req, res) => {
  try {
    const response = await axios.post(`${ML_URL}/predict-soil`, req.body);

    const newPrediction = {
      id: predictions.length + 1,
      type: "soil",
      result: response.data,
      createdAt: new Date(),
    };

    predictions.unshift(newPrediction);
    res.json(newPrediction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML service not reachable" });
  }
});

// ==============================
// AI RECOMMENDATION (Claude with rule-based fallback)
// ==============================
app.post("/recommendation", async (req, res) => {
  const { temperature, humidity, ph, risk } = req.body;

  if (
    temperature === undefined ||
    humidity === undefined ||
    ph === undefined ||
    risk === undefined
  ) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Try Claude if available
  if (client) {
    try {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: `Soil Conditions:
Temperature: ${temperature}°C
Humidity: ${humidity}%
pH: ${ph}
Risk Level: ${risk}%

Give 2-3 short, practical farming recommendations to reduce crop disease risk. Be direct and actionable. No intro sentence.`,
          },
        ],
      });
      return res.json({ recommendation: message.content[0].text, source: "ai" });
    } catch (err) {
      console.warn("Claude API unavailable, using rule-based fallback:", err.message);
    }
  }

  // Fallback — always succeeds
  res.json({ recommendation: fallbackRecommendation({ temperature, humidity, ph, risk }), source: "rules" });
});

// ==============================
// IMAGE PREDICTION
// ==============================
app.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(`${ML_URL}/predict-image`, form, {
      headers: form.getHeaders(),
    });

    const newPrediction = {
      id: predictions.length + 1,
      type: "image",
      result: response.data,
      createdAt: new Date(),
    };

    predictions.unshift(newPrediction);
    fs.unlinkSync(req.file.path);

    res.json(newPrediction);
  } catch (error) {
    console.error(error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Image prediction failed" });
  }
});

// ==============================
// HISTORY
// ==============================
app.get("/history", (req, res) => {
  res.json(predictions);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
