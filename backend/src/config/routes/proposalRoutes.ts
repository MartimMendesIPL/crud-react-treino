import { Router } from 'express';
import {
  getAll, getById, create, update, remove,
  getItems, createItem, updateItem, removeItem,
} from '../controllers/proposalController.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

// Proposal items (nested)
router.get('/:proposalId/items', getItems);
router.post('/:proposalId/items', createItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', removeItem);

export default router;
