// src/handler.js

const express = require("express");
const serverless = require("serverless-http");
const Airtable = require("airtable");
const router = express.Router();

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const app = express();

router.get("/get-records", async (req, res) => {
  try {
    const records = [];
    await base(process.env.AIRTABLE_TABLE_NAME)
      .select({ maxRecords: 10 })
      .eachPage((partial, fetchNextPage) => {
        partial.forEach(r => records.push(r.fields));
        fetchNextPage();
      });
      
    res.set("Access-Control-Allow-Origin", "*");
    res.json({ data: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Airtable records" });
  }
});

app.use("/.netlify/functions/airtable", router);

module.exports.handler = serverless(app);
