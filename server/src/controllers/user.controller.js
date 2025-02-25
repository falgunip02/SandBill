import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (email) => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secrets are not defined in the environment variables");
  }

  console.log("Generating tokens for email:", email);
  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Controller: Create New User
const createNewUser = asyncHandler(async (req, res) => {
  const { name, surname, email, password, address, phone } = req.body;

  if (!name || !surname || !email || !password || !address || !phone) {
    throw new ApiError(
      400,
      "All fields (name, surname, email, password, address, phone) are required"
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const newUser = await User.create({ name, surname, email, password, address, phone });
  res
    .status(201)
    .json(new ApiResponse(201, newUser, "User Created Successfully"));
});

// Controller: Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.email);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  console.log("Secure ? :", process.env.NODE_ENV !== "development");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "none",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export { createNewUser, loginUser };