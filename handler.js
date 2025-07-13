// src/handler.js
const express = require("express");
const serverless = require("serverless-http");
const Airtable = require("airtable");

// Airtable configuration
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const app = express();

app.get("/get-records", async (req, res) => {
  try {
    const records = [];
    await base(process.env.AIRTABLE_TABLE_NAME)
      .select({ maxRecords: 10 })
      .eachPage((partialRecords, fetchNextPage) => {
        partialRecords.forEach((record) => {
          records.push(record.fields);
        });
        fetchNextPage();
      });

    res.json({ data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Airtable records" });
  }
});

module.exports.handler = serverless(app);
