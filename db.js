import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs"

//const sqlite3 = require("sqlite3").verbose();
//const path = require("path");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "my-database.db");
const db = new sqlite3.Database(dbPath);

function createTable() {
  db.run(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    headID INTEGER,
    isHead INTEGER NOT NULL,
    name TEXT NOT NULL,
    fatherName TEXT NOT NULL,
    motherName TEXT NOT NULL,
    tehsil TEXT NOT NULL,
    district TEXT NOT NULL,
    dob INTEGER NOT NULL, -- Store dob as an INTEGER (UNIX timestamp)
    status TEXT NOT NULL
  )
`);

db.run(`
  CREATE TRIGGER IF NOT EXISTS update_headID
  AFTER INSERT ON records
  BEGIN
    UPDATE records
    SET headID = NEW.id
    WHERE isHead = 1 AND headID IS NULL;
  END
`);
}

function preseedData() {
    const initialData = [
      {
        name: "Vikram",
        fatherName: "Mularam",
        motherName: "Geeta",
        tehsil: "बाड़मेर",
        district: "बाड़मेर",
        dob: new Date("2000-01-01").getTime(),
        status: "unmarried",
        isHead:1,
      },
      {
        name: "Akaram",
        fatherName: "Mularam",
        motherName: "Geeta",
        tehsil: "बाड़मेर",
        district: "बाड़मेर",
        dob: new Date("1990-01-01").getTime(),
        status: "married",
        isHead:1,
      },
      // Add more initial data as needed
    ];
  
    // Insert the initial data into the "records" table
    const insertQuery =
      "INSERT INTO records (name, fatherName, motherName, tehsil, district, dob, status,isHead) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
    initialData.forEach((record) => {
      db.run(insertQuery, [
        record.name,
        record.fatherName,
        record.motherName,
        record.tehsil,
        record.district,
        record.dob,
        record.status,
        record.isHead,
      ]);
      console.log("Preseeded data inserted."+record.name);
    });
  
    console.log("Preseeded data inserted.");
  }

// Check if the database file exists
const exists = fs.existsSync(dbPath);

if (!exists) {
  // If the database file does not exist, create the table and preseed data
  createTable();
  //preseedData();
} else {
  // If the database file already exists, do nothing (data will persist)
  console.log("Database file already exists. Data will persist.");
}

//module.exports = db;

export {db}