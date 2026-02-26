import { Router } from 'express';
import itemRoutes from './itemRoutes.js';

const router = Router();

router.use('/items', itemRoutes);

// Adicione novas rotas aqui, ex:
// router.use('/users', userRoutes);

export default router;
