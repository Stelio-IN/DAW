import { Router } from 'express';
import productImageController from '../controllers/productImageController.js';

const router = Router();

router.post('/', productImageController.createProductImage);
router.get('/', productImageController.getAllProductImages);
router.get('/:id', productImageController.getProductImageById);
router.put('/:id', productImageController.updateProductImage);
router.delete('/:id', productImageController.deleteProductImage);

export default router;
