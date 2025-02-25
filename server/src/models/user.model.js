import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true
});

const User =  mongoose.model("users", userSchema);

export default User;