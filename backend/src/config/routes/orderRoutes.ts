import { Router } from 'express';
import {
  getAll, getById, create, update, remove,
  getItems, createItem, updateItem, removeItem,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

// Order items (nested)
router.get('/:orderId/items', getItems);
router.post('/:orderId/items', createItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', removeItem);

export default router;
