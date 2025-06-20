import Prospect from '../models/prospects.js';

// Create a new prospect
export const createProspect = async (req, res) => {
  try {
    const prospect = new Prospect(req.body);
    await prospect.save();
    res.status(201).json(prospect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all prospects
export const getProspects = async (req, res) => {
  try {
    const prospects = await Prospect.find();
    res.status(200).json(prospects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single prospect by ID
export const getProspectById = async (req, res) => {
  try {
    const prospect = await Prospect.findById(req.params.id);
    if (!prospect) return res.status(404).json({ message: 'Prospect not found' });
    res.status(200).json(prospect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a prospect
export const updateProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prospect) return res.status(404).json({ message: 'Prospect not found' });
    res.status(200).json(prospect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a prospect
export const deleteProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findByIdAndDelete(req.params.id);
    if (!prospect) return res.status(404).json({ message: 'Prospect not found' });
    res.status(200).json({ message: 'Prospect deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
