// routes/userRouter.js
import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Rota de login (rota pública)
router.post('/login', userController.loginUser);

// Rota para criar um novo usuário (pode ser pública ou protegida dependendo da sua regra de negócio)
router.post('/', userController.createUser);

// Rotas protegidas por autenticação
router.get('/profile', authenticateToken, userController.getUserProfile);  // Exemplo de rota protegida
router.get('/', authenticateToken, userController.getAllUsers);             // Protegida com token
router.get('/:id', authenticateToken, userController.getUserById);          // Protegida com token
router.delete('/:id', authenticateToken, userController.deleteUser);        // Protegida com token
router.put('/:id', authenticateToken, userController.updateUser);           // Protegida com token

export default router;
