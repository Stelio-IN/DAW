import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import paypal from '@paypal/checkout-server-sdk';

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


// paypal
const environment = new paypal.core.SandboxEnvironment(
    'AerA9zAAOphDi3X_h8qYVVrKhKLDSbnI0YNH_CsgcPmV5uQOB5zaq-MH5QgLiGgsLYUm0KplpHV8OJoF',
    'EPpS6S2sZ6vQx6TufxeoMxhmXkr4Q9CIllVyjqxcdU3GnxCA3yijNhHlD5xZ-LOHKNX3ZRX2c7LV8N4Y'
  );
  const client = new paypal.core.PayPalHttpClient(environment);
  
  // Atualize a rota /create-order
app.post('/create-order', async (req, res) => {
  const { total } = req.body; // Recebe o valor total do frontend

  if (!total || total <= 0) {
    return res.status(400).json({ error: "Valor inválido para pagamento." });
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: total.toFixed(2), // Certifique-se de formatar o valor corretamente
        },
      },
    ],
  });

  try {
    const response = await client.execute(request);
    res.json({ id: response.result.id });
  } catch (error) {
    console.error("Erro ao criar ordem do PayPal:", error);
    res.status(500).json({ error: "Erro ao processar o pagamento." });
  }
});

  
  app.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const response = await client.execute(request);
    res.json(response.result);
  });