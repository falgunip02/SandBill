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

// Get All Clients with Assigned Person Details
const getAllClients = asyncHandler(async (req, res) => {
  try {
    const clients = await Client.find()
      .populate({
        path: 'assignedPerson',
        select: 'name email' // Only get name and email of assigned person
      })
      .sort({ createdAt: -1 });

    // Format the response data
    const formattedClients = clients.map(client => ({
      _id: client._id,
      clientName: client.clientName,
      clientLocation: client.clientLocation || '',
      clientWebsite: client.clientWebsite || '',
      assignedPerson: client.assignedPerson ? {
        name: client.assignedPerson.name,
        email: client.assignedPerson.email
      } : null,
      createdAt: client.createdAt
    }));

    res.status(200).json(
      new ApiResponse(
        200,
        formattedClients,
        "Clients fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching clients: " + error.message);
  }
});

// Get Single Client with Details
const getClientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const client = await Client.findById(id)
    .populate({
      path: 'assignedPerson',
      select: 'name email'
    });

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  // Format single client response
  const formattedClient = {
    _id: client._id,
    clientName: client.clientName,
    clientLocation: client.clientLocation || '',
    clientWebsite: client.clientWebsite || '',
    assignedPerson: client.assignedPerson ? {
      name: client.assignedPerson.name,
      email: client.assignedPerson.email
    } : null,
    createdAt: client.createdAt,
    // Add any additional fields you want to return
  };

  res.status(200).json(
    new ApiResponse(
      200,
      formattedClient,
      "Client details fetched successfully"
    )
  );
});

// Search Clients
const searchClients = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const clients = await Client.find({
    $or: [
      { clientName: { $regex: query, $options: 'i' } },
      { clientLocation: { $regex: query, $options: 'i' } }
    ]
  })
  .populate({
    path: 'assignedPerson',
    select: 'name email'
  })
  .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      clients,
      "Search results fetched successfully"
    )
  );
});

// Get Client Statistics
const getClientStats = asyncHandler(async (req, res) => {
  const stats = await Client.aggregate([
    {
      $group: {
        _id: null,
        totalClients: { $sum: 1 },
        locations: { $addToSet: "$clientLocation" }
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalClients: stats[0]?.totalClients || 0,
        uniqueLocations: stats[0]?.locations.length || 0
      },
      "Client statistics fetched successfully"
    )
  );
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

export {
  createClient,
  getAllClients,
  getClientById,
  searchClients,
  getClientStats,
  updateClient,
  deleteClient
};
