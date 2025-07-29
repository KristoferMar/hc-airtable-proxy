// src/handler.js

const express = require("express");
const serverless = require("serverless-http");
const Airtable = require("airtable");
const router = express.Router();

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const app = express();

// ✅ Global CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://stotmedhjerte.dk");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Route
router.get("/get-records", async (req, res) => {
  try {
    const airtableRecords = await base(process.env.AIRTABLE_TABLE_NAME)
      .select({ maxRecords: 10 })
      .all();

    const records = airtableRecords.map(r => r.fields);

    res.json({ data: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Airtable records" });
  }
});


app.use("/.netlify/functions/airtable", router);

module.exports.handler = serverless(app);
