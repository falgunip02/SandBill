import express from 'express';
import { createBill } from '../controllers/bill.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/bills', upload.single('invoiceDocument'), createBill);

export default router; 