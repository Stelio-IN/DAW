import { Router } from 'express';
import orderItemController from '../controllers/orderItemController.js';

const router = Router();

router.post('/', orderItemController.createOrderItem);
router.get('/', orderItemController.getAllOrderItems);
router.get('/:id', orderItemController.getOrderItemById);
router.put('/:id', orderItemController.updateOrderItem);
router.delete('/:id', orderItemController.deleteOrderItem);

export default router;
