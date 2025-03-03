import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';


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


// Get All Users for Dropdown
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('name email')
    .sort({ name: 1 });

  if (!users?.length) {
    throw new ApiError(404, "No users found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      users.map(user => ({
        value: user._id,
        label: `${user.name} (${user.email})`
      })),
      "Users fetched successfully"
    )
  );
});





const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Send response
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            message: "Logged in successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout controller
const logout = async (req, res) => {
    try {
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
  createNewUser,
  login,

  getAllUsers,
  logout
};