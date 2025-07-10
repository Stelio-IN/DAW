import { Router } from 'express';
import productController from '../controllers/productController.js';

const router = Router();

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/busca-id/:id', productController.getProductById);

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.get('/pr', productController.products);
router.get('/pr/:id', productController.getProductsEspecific);
router.get('/compras', productController.ProductHistory);
router.get('/compras/:orderId', productController.ProductHistoryByOrderId);
router.get('/pr/byCategories/:categoryIds', productController.getProductsByCategories);
router.get('/pr/byColor/:colorId', productController.getProductsByColor);
router.get('/pr/byPrice/:min/:max', productController.getProductsByPrice);
router.get('/pr/bySizes/:sizeIds', productController.getProductsBySize);
router.get('/pr/byGender/:genderId', productController.getProductsByGender);
router.get('/faturamento/mensal', productController.getFaturamentoMesAtual);
router.get('/pedido/mensal', productController.getTotalPedidosMensais);
router.get('/faturamento/diario', productController.getFaturamentoPorDia);
router.get('/categorias/mais-vendidas', productController.getCategoriasMaisVendidas);
router.get('/categorias/mais-vendidas-mensal', productController.getCategoriasVendidasPorMes);
router.get('/produto/mais-vendidos-mensal', productController.getProdutosMaisVendidosPorMes );
router.get('/faturamento/por-hora', productController.getpedidosEReceitaPorHora);



export default router;
