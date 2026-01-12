// const { register, logout, SendOtp, verifyOtp, login , ResetPassword, getProfile, updateProfile, deleteProfilePhoto, loginWithGoogle, SendEmailCode, verifyEmailCode, getAllUser, signupWithGoogle } = require("../controller/authcontroller");
// const { auth } = require("../middleware/authenticate");
// const upload = require("../middleware/uploadMiddleware");

// const router=require("express").Router();


// router.post("/register",register)
// router.post("/login", login);
// router.post("/login-with-google", loginWithGoogle)
// router.post("/signup-with-google",signupWithGoogle)
// router.post("/send-code",SendEmailCode)
// router.post("/verify-code",verifyEmailCode)
// router.post("/sendotp",SendOtp)
// router.post("/verify",verifyOtp)
// router.post("/resetpassword",ResetPassword)
// router.get("/logout",auth,logout)
// router.get("/profile", auth, getProfile);
// router.put("/profile/update", auth, upload.single('profilePhoto'), updateProfile);
// router.post("/profile/upload-photo", auth, upload.single('profilePhoto'), updateProfile);
// router.delete("/profile/photo", auth, deleteProfilePhoto);
// router.get("/getalluser",getAllUser)

// module.exports = router;


import express from "express";

import {
  register,
  logout,
  SendOtp,
  verifyOtp,
  login,
  ResetPassword,
  getProfile,
  updateProfile,
  deleteProfilePhoto,
  loginWithGoogle,
  SendEmailCode,
  verifyEmailCode,
  getAllUser,
  signupWithGoogle,
} from "../controller/authcontroller.js";

import { auth } from "../middleware/authenticate.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* -------------------- Auth Routes -------------------- */
router.post("/register", register);
router.post("/login", login);

router.post("/login-with-google", (req, res, next) => {
  console.log("➡️ ROUTE: /login-with-google");
  next();
}, loginWithGoogle);

router.post("/signup-with-google", (req, res, next) => {
  console.log("➡️ ROUTE: /signup-with-google");
  next();
}, signupWithGoogle);


/* -------------------- OTP Routes -------------------- */
router.post("/send-code", SendEmailCode);
router.post("/verify-code", verifyEmailCode);
router.post("/sendotp", SendOtp);
router.post("/verify", verifyOtp);

/* -------------------- Password -------------------- */
router.post("/resetpassword", ResetPassword);

/* -------------------- Profile -------------------- */
router.get("/logout", auth, logout);
router.get("/profile", auth, getProfile);

router.put(
  "/profile/update",
  auth,
  upload.single("profilePhoto"),
  updateProfile
);

router.post(
  "/profile/upload-photo",
  auth,
  upload.single("profilePhoto"),
  updateProfile
);

router.delete("/profile/photo", auth, deleteProfilePhoto);

/* -------------------- Admin -------------------- */
router.get("/getalluser", getAllUser);

export default router;
