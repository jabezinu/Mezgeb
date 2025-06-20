import express from 'express';
import { 
  createProspect, 
  getProspects, 
  getProspectById, 
  updateProspect, 
  deleteProspect 
} from '../controllers/prospectController.js';

const router = express.Router();

// Create a new prospect
router.post('/', createProspect);

// Get all prospects
router.get('/', getProspects);

// Get a single prospect by ID
router.get('/:id', getProspectById);

// Update a prospect
router.put('/:id', updateProspect);

// Delete a prospect
router.delete('/:id', deleteProspect);

export default router;
