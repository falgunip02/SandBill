import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema({
    jobNumber: {
        type: String,
        required: true,
        unique: true
    },
    estimateDate: {
        type: Date,
        required: true
    },
    clientName: {
        type: String,
        required: [true, "Client name is required"],
        trim: true
    },
    narration: {
        type: String
    },
    estimateAmount: {
        type: Number,
        required: true
    },
    poStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    taxInvoiceDate: {
        type: Date
    },
    billedAmount: {
        type: Number,
        default: 0
    },
    balanceBillingAmount: {
        type: Number,
        default: 0
    },
    billingDate: {
        type: Date
    },
    clientLocation: {
        type: String,
        default: ""
    },
    clientWebsite: {
        type: String,
        default: ""
    },
    // clientPhoto: {
    //     type: String,
    //     required: [true, "Client logo is required"]
    // },
    clientAssigned: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model("Client", clientSchema);