import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


// Importação das rotas
import routerUser from './routes/userRoutes.js';
import routerProduct from './routes/productRoutes.js';
import routerCategory from './routes/categoryRoutes.js';
import routerColor from './routes/colorRoutes.js';
import routerProductColor from './routes/productColorRoutes.js';
import routerProductImage from './routes/productImageRoutes.js';
import routerOrder from './routes/orderRoutes.js';
import routerOrderItem from './routes/orderItemRoutes.js';

const app = express();

// Opções de CORS
const corsOptions = {
    origin: '*', // Permite requisições de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/users', routerUser);
app.use('/api/products', routerProduct);
app.use('/api/categories', routerCategory);
app.use('/api/colors', routerColor);
app.use('/api/product-colors', routerProductColor);
app.use('/api/product-images', routerProductImage);
app.use('/api/orders', routerOrder);
app.use('/api/order-items', routerOrderItem);

// Rota de teste
app.get('/', (req, res) => {
    res.json('API DAO SEMESTRAL WORK');
});

// Porta do servidor
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
