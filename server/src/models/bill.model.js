import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  jobNo: {
    type: String,
    required: true,
  },
  estimateDate: {
    type: Date,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  narration: {
    type: String,
    required: true,
  },
  estimateAmount: {
    type: Number,
    required: true,
  },
  poStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    required: true,
  },
  // status: {
  //   type: String,
  //   enum: ['Open', 'Partially Paid', 'Paid', 'Overdue'],
  //   required: true,
  // },
  
  taxInvoiceDate: {
    type: Date,
    required: true,
  },
  billedAmount: {
    type: Number,
    required: true,
  },
  balanceBillingAmount: {
    type: Number,
    required: true,
  },
  billingDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  // In Bill schema
paymentStatus: {
  type: String,
  enum: ['Not Started', 'In Progress', 'Completed'],
  default: 'Not Started',
},
status: {
  type: String,
  enum: ['Open', 'Partially Paid', 'Paid', 'Overdue'],
  required: true,
},
  daysOverdue: {
    type: Number,
    default: 0,
  },
  paymentHistory: [
    {
      amount: Number,
      date: Date,
      notes: String,
    },
  ],
  remindersSent: [
    {
      date: Date,
      type: String, // 'First', 'Second', 'Final'
    },
  ],
  lastReminderDate: Date,
  nextReminderDate: Date,
}, {
  timestamps: true,
});

// Calculate days overdue and update status
billSchema.pre('save', function(next) {
  const today = new Date();
  const dueDate = new Date(this.dueDate);

  // Calculate days overdue
  if (today > dueDate && this.status !== 'Paid') {
    const diffTime = Math.abs(today - dueDate);
    this.daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Update status to Overdue if past due date
    if (this.status !== 'Overdue') {
      this.status = 'Overdue';
    }
  }

  // Update payment status based on amounts
  if (this.billedAmount === 0) {
    this.paymentStatus = 'Not Started';
  } else if (this.balanceBillingAmount > 0) {
    this.paymentStatus = 'In Progress';
    this.status = 'Partially Paid';
  } else if (this.balanceBillingAmount === 0) {
    this.paymentStatus = 'Completed';
    this.status = 'Paid';
  }

  next();
});

// Method to add payment
billSchema.methods.addPayment = async function(amount, notes = '') {
  this.paymentHistory.push({
    amount,
    date: new Date(),
    notes,
  });

  this.billedAmount += amount;
  this.balanceBillingAmount = this.estimateAmount - this.billedAmount;

  await this.save();
};

// Method to schedule next reminder
billSchema.methods.scheduleReminder = function() {
  const today = new Date();
  const reminderTypes = ['First', 'Second', 'Final'];
  const currentReminderCount = this.remindersSent.length;

  if (currentReminderCount < reminderTypes.length) {
    this.nextReminderDate = new Date(today.setDate(today.getDate() + 7));
  }
};

const Bill = mongoose.model('Bill', billSchema);

export default Bill;