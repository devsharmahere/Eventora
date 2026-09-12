import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["account_verification", "event_booking"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  }, // OTP expires in 5 minutes
});

export const OTP = mongoose.model("OTP", otpSchema);
