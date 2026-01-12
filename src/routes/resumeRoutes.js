import express from "express";
import multer from "multer";
import path from "path";

import { auth } from "../middleware/authenticate.js";
import {
  downloadPdf,
  downloadDoc,
  saveResume,
  getResume,
  uploadResume,
  getUserResumes,
  uploadToGoogleDocs,
} from "../controller/resumeController.js";

import { enhanceResume } from "../utils/resumeEnhancer.js";

const router = express.Router();

/* -------------------- Multer Config -------------------- */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter(req, file, cb) {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF and Word documents are allowed"));
  },
});

/* -------------------- Resume Routes -------------------- */
router.post("/upload", auth, upload.single("resume"), uploadResume);

router.post(
  "/upload-to-google-docs",
  auth,
  upload.single("file"),
  uploadToGoogleDocs
);

router.get("/get", auth, getResume);
router.get("/user-resumes", auth, getUserResumes);

router.post("/download-pdf", auth, downloadPdf);
router.post("/download-doc", auth, downloadDoc);
router.post("/save", auth, saveResume);

/* -------------------- Enhance Resume -------------------- */
router.post("/enhance", async (req, res) => {
  try {
    const { resumeContent, jobTitle } = req.body;

    if (!resumeContent || !jobTitle) {
      return res.status(400).json({
        error: "Resume content and job title are required",
      });
    }

    const enhancedResume = await enhanceResume(resumeContent, jobTitle);
    res.json({ enhancedResume });
  } catch (error) {
    console.error("Error in resume enhancement:", error);
    res.status(500).json({ error: "Failed to enhance resume" });
  }
});

export default router;
