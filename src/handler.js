// src/handler.js
// Remove dotenv import — Netlify injects env vars automatically

const express = require("express");
const serverless = require("serverless-http");
const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const app = express();

app.get("/get-records", async (req, res) => {
  try {
    const records = [];
    await base(process.env.AIRTABLE_TABLE_NAME)
      .select({ maxRecords: 10 })
      .eachPage((partial, fetchNextPage) => {
        partial.forEach(r => records.push(r.fields));
        fetchNextPage();
      });

    res.json({ data: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Airtable records" });
  }
});

module.exports.handler = serverless(app);
