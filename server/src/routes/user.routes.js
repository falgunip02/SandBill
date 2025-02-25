import express from 'express';
import { createNewUser,loginUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/createNewUser', createNewUser);
router.post('/login', loginUser);

export default router; // Use default export
