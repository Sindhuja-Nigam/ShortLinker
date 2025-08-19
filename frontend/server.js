import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import shortid from "shortid";
import Url from "./models/urlModel.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// API to shorten URL
app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) return res.status(400).json({ error: "URL is required" });

  try {
    const shortCode = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    const newUrl = new Url({ longUrl, shortUrl });
    await newUrl.save();

    res.json(newUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect endpoint
app.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: `${process.env.BASE_URL}/${req.params.shortCode}` });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
