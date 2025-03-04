import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Client from "../models/client.model.js";
import User from "../models/user.model.js"; // Ensure assigned person exists

// Create Client
const createClient = asyncHandler(async (req, res) => {
  const { name, assignedPerson, location, website = "" } = req.body;
  const logo = req.file ? req.file.path : ""; // Handle logo upload

  // Validate required fields
  if (!name || !assignedPerson || !location) {
    throw new ApiError(400, "Name, assigned person, and location are required.");
  }

  // Check if assignedPerson exists
  const userExists = await User.findById(assignedPerson);
  if (!userExists) {
    throw new ApiError(400, "Assigned person not found in the database.");
  }

  try {
    const newClient = await Client.create({
      name,
      assignedPerson,
      location,
      website,
      logo, // Store logo path if uploaded
    });

    const populatedClient = await Client.findById(newClient._id)
      .populate("assignedPerson", "name email") // Populate assigned person details
      .lean();

    res.status(201).json(new ApiResponse(201, populatedClient, "Client created successfully"));
  } catch (error) {
    console.error("Error creating client:", error);
    throw new ApiError(500, "Error creating client");
  }
});

// Get All Clients
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find()
    .populate("assignedPerson", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(new ApiResponse(200, clients, "Clients fetched successfully"));
});

// Get Client by ID
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id)
    .populate("assignedPerson", "name email")
    .lean();

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  res.status(200).json(new ApiResponse(200, client, "Client fetched successfully"));
});

// Update Client
const updateClient = asyncHandler(async (req, res) => {
  const { name, assignedPerson, location, website } = req.body;
  const updates = { name, location, website };
  if (req.file) updates.logo = req.file.path; // Update logo if uploaded

  if (assignedPerson) {
    const userExists = await User.findById(assignedPerson);
    if (!userExists) {
      throw new ApiError(400, "Assigned person not found in the database.");
    }
    updates.assignedPerson = assignedPerson;
  }

  const client = await Client.findByIdAndUpdate(req.params.id, updates, { new: true })
    .populate("assignedPerson", "name email")
    .lean();

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  res.status(200).json(new ApiResponse(200, client, "Client updated successfully"));
});

// Delete Client
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id).lean();

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Client deleted successfully"));
});

export { createClient, getAllClients, getClientById, updateClient, deleteClient };
