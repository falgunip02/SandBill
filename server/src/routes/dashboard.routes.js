import express from 'express';
import { getDashboardData, getWeeklyDashboardData } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/', getDashboardData);
router.get('/weeklyData', getWeeklyDashboardData);

export default router;