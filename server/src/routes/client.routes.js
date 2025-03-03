import express from 'express';
import { createClient, getAllClients, getClientById, updateClient, deleteClient } from '../controllers/client.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/v1/clients
 * @desc    Create a new client
 * @access  Public
 */
router.post('/', upload.single('clientPhoto'), createClient);

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients
 * @access  Public
 */
router.get('/', getAllClients);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get client by ID
 * @access  Public
 */
router.get('/:id', getClientById);

/**
 * @route   PUT /api/v1/clients/:id
 * @desc    Update client
 * @access  Public
 */
router.put('/:id', upload.single('clientPhoto'), updateClient);

/**
 * @route   DELETE /api/v1/clients/:id
 * @desc    Delete client
 * @access  Public
 */
router.delete('/:id', deleteClient);

export default router; 