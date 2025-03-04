import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Client from "../models/client.model.js";

// Create Client
const createClient = asyncHandler(async (req, res) => {
  const { clientName, assignedPerson, estimateAmount, estimateDate, jobNumber, clientLocation = "", clientWebsite = "" } = req.body;
  console.log(req.body);

  // Validate required fields
  if (!clientName || !assignedPerson || !estimateAmount || !estimateDate || !jobNumber) {
    throw new ApiError(400, "Client name, assigned person, estimate amount, estimate date, and job number are required");
  }

  try {
    // Create new client
    const newClient = await Client.create({
      clientName,
      clientLocation,
      clientWebsite,
      estimateAmount,
      estimateDate,
      jobNumber,
      clientAssigned: [{ userId: assignedPerson }]
    });

    // Populate the assigned user details
    const populatedClient = await Client.findById(newClient._id)
      .populate("clientAssigned.userId", "name email");

    res.status(201).json(
      new ApiResponse(201, populatedClient, "Client created successfully")
    );
  } catch (error) {
    console.error("Error creating client:", error);
    throw new ApiError(500, "Error creating client");
  }
});


// Get All Clients
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find()
    .populate('clientAssigned.userId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, clients, "Clients fetched successfully")
  );
});

// Get Client by ID
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id)
    .populate('clientAssigned.userId', 'name email');

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  res.status(200).json(
    new ApiResponse(200, client, "Client fetched successfully")
  );
});

// Update Client
const updateClient = asyncHandler(async (req, res) => {
  const { clientName, assignedPerson, clientLocation, clientWebsite } = req.body;
  const updates = {
    clientName,
    clientLocation,
    clientWebsite,
    ...(assignedPerson && {
      clientAssigned: [{ userId: assignedPerson }]
    })
  };

  if (req.file) {
    updates.clientPhoto = req.file.path;
  }

  const client = await Client.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  ).populate('clientAssigned.userId', 'name email');

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  res.status(200).json(
    new ApiResponse(200, client, "Client updated successfully")
  );
});

// Delete Client
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  res.status(200).json(
    new ApiResponse(200, null, "Client deleted successfully")
  );
});

export {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
}; 