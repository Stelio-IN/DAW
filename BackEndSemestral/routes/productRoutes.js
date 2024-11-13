import { Router } from 'express';
import productController from '../controllers/productController.js';

const router = Router();

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/busca-id/:id', productController.getProductById);

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.get('/pr', productController.products);



export default router;
