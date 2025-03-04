import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    assignedPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, default:""},
    website: { type: String, default: "" },
    logo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
