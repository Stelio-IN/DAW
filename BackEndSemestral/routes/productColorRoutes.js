import { Router } from 'express';
import productColorController from '../controllers/productColorController.js';

const router = Router();

router.post('/', productColorController.createProductColor);
router.get('/', productColorController.getAllProductColors);
router.get('/:id', productColorController.getProductColorById);
router.put('/:id', productColorController.updateProductColor);
router.delete('/:id', productColorController.deleteProductColor);

export default router;
