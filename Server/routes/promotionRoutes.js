import { Router } from 'express';
import promotionController from '../controllers/promotionController.js';

const router = Router();

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getAllPromotions);
router.get('/:id', promotionController.getPromotionById);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

export default router;
