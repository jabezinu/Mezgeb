import mongoose from 'mongoose';

const prospectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
  location: {type: String},
},{
    timestamps: true,
});

const Prospect = mongoose.model('Prospect', prospectSchema);

export default Prospect;