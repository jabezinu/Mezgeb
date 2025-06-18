import express from 'express';
import { getClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clientController.js';

const router = express.Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
