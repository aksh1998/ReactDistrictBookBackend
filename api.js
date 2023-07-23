import express from "express";
import cors from "cors";
import {db} from "./db.js"

// const express = require("express");
// const cors = require("cors");
// const db = require("./db");

const app = express();

app.use("/", (req, res) => {
  res.json({ message: "Hello From Express App" });
});

app.use(cors());

// API endpoint for fetching a single record by ID
app.get("/api/records/:id", (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM records WHERE id = ?", id, (err, record) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch record" });
      } else {
        if (!record) {
          res.status(404).json({ error: "Record not found" });
        } else {
          res.json(record);
        }
      }
    });
  });
  
  // API endpoint for fetching all records
  app.get("/api/headrecords", (req, res) => {
    db.all("SELECT * FROM records WHERE isHead = 1", (err, records) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch records" });
      } else {
        res.json(records);
      }
    });
  });

  // API endpoint for fetching all records
  app.get("/api/records", (req, res) => {
    db.all("SELECT * FROM records", (err, records) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch records" });
      } else {
        res.json(records);
      }
    });
  });

  app.get("/api/records/family/:id", (req, res) => {
    const id = req.params.id;
    db.all("SELECT * FROM records WHERE headID = ?", id, (err, records) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch record" });
      } else {
        if (!records) {
          res.status(404).json({ error: "Record not found" });
        } else {
          res.json(records);
        }
      }
    });
  });

  
  app.post("/api/records", (req, res) => {
    const record = req.body;
    db.run(
      "INSERT INTO records (name, fatherName, motherName, tehsil, district, dob, status, isHead, headID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        record.name,
        record.fatherName,
        record.motherName,
        record.tehsil,
        record.district,
        record.dob,
        record.status,
        record.isHead,
        record.headID, // Ensure headID is set properly if provided
      ],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to add record" });
        } else {
          res.sendStatus(201);
        }
      }
    );
  });
  
  // API endpoint for updating an existing record
  app.put("/api/records/:id", (req, res) => {
    const id = req.params.id;
    const record = req.body;
    db.run(
      "UPDATE records SET name = ?, fatherName = ?, motherName = ?, tehsil = ?, district = ?, dob = ?, status = ?, isHead = ?, headID = ? WHERE id = ?",
      [
        record.name,
        record.fatherName,
        record.motherName,
        record.tehsil,
        record.district,
        record.dob,
        record.status,
        record.isHead,
        record.headID, // Ensure headID is set properly if provided
        id,
      ],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to update record" });
        } else {
          res.sendStatus(200);
        }
      }
    );
  });

// API endpoint for deleting a record
app.delete("/api/records/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM records WHERE id = ?", id, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete record" });
    } else {
      res.sendStatus(200);
    }
  });
});

app.get("/", (req, res) => {
  console.log(req)

  res.json("welcome to api");
});

// Start the server
app.listen(3009, () => {
  console.log("Server started on port 3009");
});
