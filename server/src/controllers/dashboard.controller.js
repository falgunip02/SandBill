import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Bill from "../models/bill.model.js";
const getDashboardData = asyncHandler(async (req, res) => {
    try {
        const bills = await Bill.find();

        let totalReceivables = 0;
        let receivedAmount = 0;
        let currentReceivables = 0;
        let overdueReceivables = 0;

        const now = new Date();

        bills.forEach(bill => {
            // Total Receivables should be based on estimateAmount
            totalReceivables += bill.estimateAmount;

            // Calculate received amount from payment history
                const totalPaid = bill.paymentHistory?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
            receivedAmount += totalPaid;

            // Calculate pending amount (based on balanceBillingAmount)
            const pendingAmount = bill.balanceBillingAmount;

            // Categorize pending amounts based on due date
            if (pendingAmount > 0) {
                if (new Date(bill.dueDate) < now) {
                    overdueReceivables += pendingAmount;
                } else {
                    currentReceivables += pendingAmount;
                }
            }
        });

        // Prepare monthly data for charts
        const monthlyData = bills.reduce((acc, bill) => {
            const month = new Date(bill.billingDate).toLocaleString('default', { month: 'short' });
            if (!acc[month]) {
                acc[month] = { receivables: 0, received: 0 };
            }
            acc[month].receivables += bill.estimateAmount;
            acc[month].received += bill.estimateAmount - bill.balanceBillingAmount;
            return acc;
        }, {});

        return res.status(200).json(
            new ApiResponse(200, {
                totalReceivables,
                receivedAmount,
                currentReceivables,
                overdueReceivables,
                monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
                    month,
                    ...data
                }))
            }, "Dashboard data retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching dashboard data: " + error.message);
    }
});


export { getDashboardData };
