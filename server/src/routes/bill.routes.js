import express from 'express';
import { createBill, getBillDetails, addPayment, getAllBills , updateBill} from '../controllers/bill.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/bills', upload.single('invoiceDocument'), createBill);
router.get('/bills', getAllBills);
router.get('/:billId', getBillDetails);
router.post(':billId/payments', addPayment);
router.put('/:billId', updateBill);

export default router;