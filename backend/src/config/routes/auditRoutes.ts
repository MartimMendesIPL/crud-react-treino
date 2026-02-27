import { Router } from 'express';
import { getAll, getByEntity, create } from '../controllers/auditController.js';

const router = Router();

router.get('/', getAll);
router.get('/:entityType/:entityId', getByEntity);
router.post('/', create);

export default router;
