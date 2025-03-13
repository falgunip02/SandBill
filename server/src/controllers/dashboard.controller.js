import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Bill from "../models/bill.model.js";

const getDashboardData = asyncHandler(async (req, res) => {
    try {
        const bills = await Bill.find();

        let totalReceivables = 0;  // Total amount that should be received
        let receivedAmount = 0;    // Amount actually received
        let currentReceivables = 0; // Amount pending but within due date
        let overdueReceivables = 0; // Amount pending and overdue

        let totalPayables = 0;     // Total amount to be paid
        let currentPayables = 0;   // Amount to be paid within due date
        let overduePayables = 0;   // Amount overdue for payment

        const now = new Date();

        bills.forEach(bill => {
            // Receivables Calculation
            if (bill.type === 'Receivable') {
                totalReceivables += bill.billedAmount;
                receivedAmount += bill.paidAmount || 0; // Track received amount

                const pendingAmount = bill.billedAmount - (bill.paidAmount || 0);

                if (pendingAmount > 0) {
                    if (new Date(bill.dueDate) < now) {
                        overdueReceivables += pendingAmount;
                    } else {
                        currentReceivables += pendingAmount;
                    }
                }
            }

            // Payables Calculation
            if (bill.type === 'Payable') {
                totalPayables += bill.billedAmount;
                
                const pendingPayable = bill.billedAmount - (bill.paidAmount || 0);

                if (pendingPayable > 0) {
                    if (new Date(bill.dueDate) < now) {
                        overduePayables += pendingPayable;
                    } else {
                        currentPayables += pendingPayable;
                    }
                }
            }
        });

        return res.status(200).json(
            new ApiResponse(200, {
                totalReceivables,
                receivedAmount,  // How much is actually received
                currentReceivables,
                overdueReceivables,
                totalPayables,
                currentPayables,
                overduePayables
            }, "Dashboard data retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching dashboard data: " + error.message);
    }
});

export { getDashboardData };
