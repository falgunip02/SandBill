import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";


// Controller: Create New User
const createNewUser = asyncHandler(async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    throw new ApiError(
      400,
      "All fields (name, surname, email, password) are required"
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const newUser = await User.create({ name, surname, email, password });
  res
    .status(201)
    .json(new ApiResponse(201, newUser, "User Created Successfully"));
});

export { createNewUser };