import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Client from "../models/client.model.js";
import User from "../models/user.model.js"; // Ensure assigned person exists

// Controller: Create New Client
const createClient = asyncHandler(async (req, res) => {
  const { clientName, assignedPerson, clientLocation, clientWebsite } = req.body;

  if (!clientName || !assignedPerson || !clientLocation) {
    throw new ApiError(400, "Name, assigned person, and location are required.");
  }

  const userExists = await User.findById(assignedPerson);
  if (!userExists) {
    throw new ApiError(400, "Assigned person not found in the database.");
  }

  const client = new Client({
    clientName,
    assignedPerson,
    clientLocation,
    clientWebsite,
  });

  const createdClient = await client.save();
  res.status(201).json(new ApiResponse(201, createdClient, "Client created successfully"));
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
  const { clientName, assignedPerson, clientLocation, clientWebsite } = req.body;
  const updates = { clientName, clientLocation, clientWebsite };

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
