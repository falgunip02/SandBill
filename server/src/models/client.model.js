import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema({
    clientName: {
        type: String,
        required: true,
    },
    clientLocation: {
        type: String,
        required: true,
    },
    clientWebsite: {
        type: String,
        required: true,
    },
    clientPhoto: {
        type: String,
        required: true,
    },
    clientAssigned: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users", // Reference to the 'users' collection
            required: true,
        },
    }],
}, {
    timestamps: true,
});

const client = mongoose.model("Client", clientSchema);

module.exports = client;