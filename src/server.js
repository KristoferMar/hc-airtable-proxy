// src/server.js
require("dotenv").config();
const express = require("express");
const app = express();
const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
