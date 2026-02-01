import { Router } from 'express';
import productColorSizeController from '../controllers/productColorSizeController.js';

const router = Router();

// Rotas CRUD para product_color_sizes
router.post('/', productColorSizeController.createProductColorSize);
router.get('/', productColorSizeController.getAllProductColorSizes);
router.get('/prod/:product_color_id', productColorSizeController.getByProductColorId);
router.get('/:id', productColorSizeController.getById);
router.put('/:id', productColorSizeController.updateProductColorSize);
router.delete('/:id', productColorSizeController.deleteProductColorSize);

export default router;
