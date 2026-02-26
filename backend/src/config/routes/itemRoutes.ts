import { Router } from 'express';
import {
  getAllItems,
  createItem,
  deleteItem,
} from '../controllers/itemController.js';

const router = Router();

router.get('/', getAllItems);
router.post('/', createItem);
router.delete('/:id', deleteItem);

export default router;
