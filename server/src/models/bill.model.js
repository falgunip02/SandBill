import mongoose from 'mongoose';
const { Schema } = mongoose;

const billSchema = new Schema({
  jobNo: {
    type: String,
    required: true
  },
  estimateDate: {
    type: Date,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  narration: {
    type: String,
    required: true
  },
  estimateAmount: {
    type: Number,
    required: true
  },
  poStatus: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  taxInvoiceDate: {
    type: Date,
    required: true
  },
  billedAmount: {
    type: Number,
    required: true
  },
  balanceBillingAmount: {
    type: Number,
    required: true
  },
  billingDate: {
    type: Date,
    required: true
  },
  invoiceDocument: {
    type: String,
    required: true
  }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;