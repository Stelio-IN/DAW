import { Router } from 'express';
import orderItemController from '../controllers/order_ItemController.js';

const router = Router();

router.post('/', orderItemController.createOrderItem);
router.get('/', orderItemController.getAllOrderItems);
router.get('/:id', orderItemController.getOrderItemById);
router.put('/:id', orderItemController.updateOrderItem);
router.delete('/:id', orderItemController.deleteOrderItem);

// Rota para obter histórico de compras de um usuário
router.get('/history/:userId', orderItemController.getOrderHistoryByUser);

export default router;
