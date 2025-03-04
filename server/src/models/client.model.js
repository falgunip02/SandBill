import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  assignedPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientLocation: {
    type: String,
  },
  clientWebsite: {
    type: String,
  },
}, {
  timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
