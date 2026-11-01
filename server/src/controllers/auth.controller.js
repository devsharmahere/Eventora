
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
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

  const createdUser = await User.create({
    fullName,
    email,
    password,
    role: "user",
    isVerified: true,
  });

  const user = await User.findById(createdUser._id).select("-password");

  res
    .status(201)
    .json(new ApiResponse(201, "User Created Successfully", user));
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

  const loggedInUser = await User.findById(user._id).select("-password");

  res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      user: loggedInUser,
      token: generateToken(user._id, user.role),
    }),
  );
});

export { registerUser, loginUser };
