import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/Entrar', userController.loginUser);
router.post('/', userController.createUser);

router.get('/profile', authenticateToken, userController.getUserProfile);

export default router;
