import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOTPEmail } from "../utils/email.js";
import { OTP } from "../models/otp.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new ApiError(409, "User already exist");
  }
  const user = await User.create({
    fullName,
    email,
    password,
    role: "user",
    isVerified: false,
  });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`OTP for ${email}: ${otp}`);
  await OTP.create({ email, otp, action: "account_verification" });

  await sendOTPEmail(email, otp, "account_verification");

  res.status(201).json(new ApiResponse(201, "User Created Successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid Email");
  }
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid Password");
  }

  if (!user.isVerified && user.role === "user") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email, action: "account_verification" }); //Remove old OTPs
    await OTP.create({ email, otp, action: "account_verification" });
    await sendOTPEmail(email, otp, "account_verification");
    throw new ApiError(
      400,
      "Account not verified. A new OTP has been sent to your email",
    );
  }
  const loggedInUser = await User.findById(user._id).select("-password ");
  res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      user: loggedInUser,
      token: generateToken(user._id, user.role),
    }),
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await OTP.findOne({
    email,
    otp,
    action: "account_verification",
  });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }
  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
  ).select("-password");
  await OTP.deleteMany({ email, action: "account_verification" }); //Remove used OTPs

  res.status(200).json(
    new ApiResponse(
      200,
      "Account verified successfully . You can now log in.",
      {
        user: user,
        token: generateToken(user._id, user.role),
      },
    ),
  );
});

export { registerUser, loginUser, verifyOtp };
