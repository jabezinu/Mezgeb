import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstVisit: { type: Date, required: true },
  nextVisit: { type: Date, required: true },
  amount: { type: Number, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['started', 'ongoing', 'closed'], default: 'started' }
}, {
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);

export default Client;