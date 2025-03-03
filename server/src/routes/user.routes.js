import express from 'express';
import { createNewUser, getAllUsers, login , logout} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', createNewUser);
router.get('/list', getAllUsers);
router.post('/login',login);
router.post('/logout',logout); 

export default router;
