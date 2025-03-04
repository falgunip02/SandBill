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
    !billingDate
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
  });

  const createdBill = await bill.save();
  res.status(201).json(new ApiResponse(201, createdBill, "Bill created successfully"));
});

// Other controller functions...

export { createBill };