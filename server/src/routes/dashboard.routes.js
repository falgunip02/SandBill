import express from 'express';
import { getDashboardData, getWeeklyDashboardData, getRecentBills } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/', getDashboardData);
router.get('/weeklyData', getWeeklyDashboardData);
router.get('/recentBills', getRecentBills);

export default router;