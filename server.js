// const express = require("express");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const rateLimit = require("express-rate-limit");
// const multer = require("multer");
// const { google } = require("googleapis");
// const fs = require("fs");
// const axios = require("axios");
// const FormData = require("form-data");

// const app = express();
// require("dotenv").config();


// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100, 
// });

// app.use(limiter);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// require("./src/config/db");

// const port = process.env.PORT || 9000;


// const corsOptions = {
//   origin: true, 
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// const authRoute = require("./src/routes/authroutes");
// const resumeRoutes = require("./src/routes/resumeRoutes");


// app.use("/api/v1/auth", authRoute);
// app.use("/api/v2/resume", resumeRoutes);

// app.get("/", (req, res) => res.send("Hello World!"));


// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   });
// });



// const upload = multer({ dest: "uploads/" });


// const KEYFILE_PATH = "./service-account.json"; // Replace with your JSON file
// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];


// const FOLDER_ID = "1FAvFWMCONQ-SToyBmskzLrs0Nb2nfk9h"; // Replace with your Google Drive Folder ID

// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILE_PATH,
//   scopes: SCOPES,
// });

// const drive = google.drive({ version: "v3", auth });


// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const fileMetadata = {
//       name: req.file.originalname,
//       parents: [FOLDER_ID], 
//       mimeType:
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     };

//     const media = {
//       mimeType: req.file.mimetype,
//       body: fs.createReadStream(req.file.path),
//     };

//     const response = await drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: "id",
//     });


//     await drive.permissions.create({
//       fileId: response.data.id,
//       requestBody: {
//         role: "writer",
//         type: "anyone",
//       },
//     });


//     res.json({ fileId: response.data.id });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // File upload route (for ATS Score and JD Matching)
// app.post("/api/v2/analyze", upload.fields([
//   { name: 'resume', maxCount: 1 },   // 'resume' will be the field for resume file
//   { name: 'jobDescription', maxCount: 1 }  // 'jobDescription' for JD file (optional)
// ]), async (req, res) => {
//   try {
//     // Check if files are uploaded
//     if (!req.files || !req.files.resume) {
//       return res.status(400).json({ message: "Resume is required" });
//     }

//     // Get the files
//     const resumeFile = req.files.resume[0]; // resume file
//     const jdFile = req.files.jobDescription ? req.files.jobDescription[0] : null; // JD file (optional)

//     // Prepare FormData for the files
//     const formData = new FormData();
//     formData.append('resume', resumeFile.buffer, 'resume.pdf');  // send as PDF, you can adjust the extension as needed
//     if (jdFile) formData.append('jobDescription', jdFile.buffer, 'jobDescription.pdf');

//     // Send request to Python microservice
//     const response = await axios.post('http://localhost:5001/analyze', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     // Return the result from the Python microservice (score, suggestions)
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred during file processing" });
//   }
// });

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// app.listen(port, () => console.log(`Server running on port ${port}!`));

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { google } from "googleapis";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

import "./src/config/db.js";
import "./src/config/firebaseAdmin.js";

import authRoute from "./src/routes/authroutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";
import connectDB from "./src/config/db.js";

dotenv.config();

connectDB();
const app = express();

/* -------------------- Rate Limiter -------------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

/* -------------------- Middlewares -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------- CORS -------------------- */
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/* -------------------- Routes -------------------- */
app.use("/api/v1/auth", authRoute);
app.use("/api/v2/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* -------------------- Error Handler -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

/* -------------------- File Upload -------------------- */
const upload = multer({ dest: "uploads/" });

const KEYFILE_PATH = "./service-account.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const FOLDER_ID = "1FAvFWMCONQ-SToyBmskzLrs0Nb2nfk9h";

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [FOLDER_ID],
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "writer",
        type: "anyone",
      },
    });

    res.json({ fileId: response.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------- ATS / JD Analysis -------------------- */
app.post(
  "/api/v2/analyze",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jobDescription", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.resume) {
        return res.status(400).json({ message: "Resume is required" });
      }

      const resumeFile = req.files.resume[0];
      const jdFile = req.files.jobDescription
        ? req.files.jobDescription[0]
        : null;

      const formData = new FormData();
      formData.append("resume", resumeFile.buffer, "resume.pdf");
      if (jdFile) {
        formData.append("jobDescription", jdFile.buffer, "jobDescription.pdf");
      }

      const response = await axios.post(
        "http://localhost:5001/analyze",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred during file processing" });
    }
  }
);

/* -------------------- 404 -------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* -------------------- Server -------------------- */
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
