import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Bill from "../models/bill.model.js";

// Controller: Create New Bill
const createBill = asyncHandler(async (req, res) => {
  const {
    jobNo,
    estimateDate,
    client,
    clientName,
    narration,
    estimateAmount,
    poStatus,
    status,
    taxInvoiceDate,
    billedAmount,
    balanceBillingAmount,
    billingDate,
    dueDate // Add this line
  } = req.body;

  if (
    !jobNo ||
    !estimateDate ||
    !client ||
    !clientName ||
    !narration ||
    !estimateAmount ||
    !poStatus ||
    !status ||
    !taxInvoiceDate ||
    !billedAmount ||
    !balanceBillingAmount ||
    !billingDate ||
    !dueDate // Add this line
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const bill = new Bill({
    jobNo,
    estimateDate,
    client,
    clientName,
    narration,
    estimateAmount,
    poStatus,
    status,
    taxInvoiceDate,
    billedAmount,
    balanceBillingAmount,
    billingDate,
    dueDate // Add this line
  });

  const createdBill = await bill.save();
  res.status(201).json(new ApiResponse(201, createdBill, "Bill created successfully"));
});

// Controller: Get Bill Details
const getBillDetails = asyncHandler(async (req, res) => {
  const { billId } = req.params;

  const bill = await Bill.findById(billId).populate('client');

  if (!bill) {
    throw new ApiError(404, 'Bill not found');
  }

  res.status(200).json({
    success: true,
    data: bill,
  });
});

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({})
      .populate('client', 'clientName')
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    if (!bills || bills.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No bills found'
      });
    }

    res.status(200).json({
      success: true,
      data: bills.map(bill => ({
        _id: bill._id, // Include the billId
        jobNo: bill.jobNo,
        clientName: bill.client.clientName,
        estimateAmount: bill.estimateAmount,
        status: bill.status,
        dueDate: bill.dueDate,
        balanceBillingAmount: bill.balanceBillingAmount,
        paymentStatus: bill.paymentStatus,
        actions: 'Actions' // Placeholder for actions
      })),
      message: 'Bills retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      message: 'Error while fetching bills',
      error: error.message
    });
  }
};

// Add Payment to a Bill
const addPayment = async (req, res) => {
  try {
    const { billId } = req.params;
    const { amount, notes } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    // Find the bill
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Add payment using model method
    await bill.addPayment(parseFloat(amount), notes);

    res.status(200).json({ message: 'Payment added successfully', bill });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBill = asyncHandler(async (req, res) => {
  const { billId } = req.params;
  const updateData = req.body;

  // Validation logic (check required fields)
  const requiredFields = [
    'jobNo', 'estimateDate', 'client', 'clientName', 'narration',
    'estimateAmount', 'poStatus', 'status', 'taxInvoiceDate',
    'billedAmount', 'balanceBillingAmount', 'billingDate', 'dueDate',
    'paymentStatus'
  ];

  // Check for missing or empty fields
  const missingFields = requiredFields.filter(field => 
    !(field in updateData) || 
    (typeof updateData[field] === 'string' && updateData[field].trim() === '')
  );

  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }

  // Update with validation
  const updatedBill = await Bill.findByIdAndUpdate(
    billId,
    updateData,
    { 
      new: true,
      runValidators: true, // Enable schema validation
      context: 'query' // Required for some validators like `trim`
    }
  );

  if (!updatedBill) {
    throw new ApiError(404, 'Bill not found');
  }

  res.status(200).json(new ApiResponse(200, updatedBill, 'Bill updated successfully'));
});

// // Controller: Get Overview Data
// const getOverviewData = asyncHandler(async (req, res) => {
//   try {
//     const bills = await Bill.find();

// //     let totalReceivables = 0;
//     let currentReceivables = 0;
//     let overdueReceivables = 0;
//     let totalPayables = 0;
//     let currentPayables = 0;
//     let overduePayables = 0;

//     bills.forEach(bill => {
//       if (bill.status === 'Paid') {
//         totalReceivables += bill.billedAmount;
//       } else {
//         totalReceivables += bill.billedAmount;
//         if (new Date(bill.dueDate) < new Date()) {
//           overdueReceivables += bill.balanceBillingAmount;
//         } else {
//           currentReceivables += bill.balanceBillingAmount;
//         }
//       }

//       // Assuming you have a similar structure for payables
//       // totalPayables += bill.payableAmount;
//       // if (new Date(bill.dueDate) < new Date()) {
//       //   overduePayables += bill.balancePayableAmount;
//       // } else {
//       //   currentPayables += bill.balancePayableAmount;
//       // }
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         totalReceivables,
//         currentReceivables,
//         overdueReceivables,
//         totalPayables,
//         currentPayables,
//         overduePayables
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });


// // In bill.controller.js
// const getDashboardData = asyncHandler(async (req, res) => {
//   try {
//     // Your dashboard logic here
//     const bills = await Bill.find();



//     let totalReceivables = 0;
//     let currentReceivables = 0;
//     let overdueReceivables = 0;
//     let totalPayables = 0;
//     let currentPayables = 0;
//     let overduePayables = 0;

//     bills.forEach(bill => {
//       if (bill.status === 'Paid') {
//         totalReceivables += bill.billedAmount;
//       } else {
//         totalReceivables += bill.billedAmount;
//         if (new Date(bill.dueDate) < new Date()) {
//           overdueReceivables += bill.balanceBillingAmount;
//         } else {
//           currentReceivables += bill.balanceBillingAmount;
//         }
//       }

//       // Assuming you have a similar structure for payables
//       // totalPayables += bill.payableAmount;
//       // if (new Date(bill.dueDate) < new Date()) {
//       //   overduePayables += bill.balancePayableAmount;
//       // } else {
//       //   currentPayables += bill.balancePayableAmount;
//       // }
//     });

      
//     // Calculate metrics...
    
//     res.status(200).json({
//       success: true,
//       data: {
//         totalReceivables,
//         currentReceivables,
//         overdueReceivables,
//         totalPayables,
//         currentPayables,
//         overduePayables
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

export { createBill, getBillDetails, addPayment, getAllBills, updateBill };