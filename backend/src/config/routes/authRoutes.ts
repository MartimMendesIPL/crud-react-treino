import { Router } from 'express';
import { login, verify, logout } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/verify', verify);
router.post('/logout', logout);

export default router;
