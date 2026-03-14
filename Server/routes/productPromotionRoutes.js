import { Router } from 'express';
import productPromotionController from '../controllers/productPromotionController.js';

const router = Router();

router.post('/', productPromotionController.createAssociation);
router.get('/', productPromotionController.getAllAssociations);
router.get('/:id', productPromotionController.getAssociationById);
router.delete('/:id', productPromotionController.deleteAssociation);

// útil para remover promoções de um produto específico
router.delete(
  '/by-promotion/:promotionId',
  productPromotionController.deleteByPromotion
);

export default router;
