import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authschema = new Schema(
  {
    first_Name: {
      type: String,
    },
    last_Name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    birth_Date: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "recruiter", "hiringmanager"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
    profilePhoto: {
      public_id: String,
      url: String,
    },
    userPhoto: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

const Auth = model("Auth", authschema);

export default Auth;
