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

import routerGender from './routes/genderRoutes.js';
import routerSize from './routes/sizeRoutes.js';
import routerSizeType from './routes/sizeTypeRoutes.js';

import paymentRoutes from './routes/paymentRoutes.js';

import imageUploadRoutes from './routes/imageUpload.js';
import jibbitzRoutes from './routes/jibbitzRoutes.js';
import routerProductColorSize from './routes/productColorSizeRoutes.js';
import routerProductPromotion from './routes/productPromotionRoutes.js';
import routerPromotion from './routes/promotionRoutes.js';
import * as mpesaService from './services/mpesa.js';



const app = express();

// Opções de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // frontend (Vite)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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
app.use('/api/product-color-size', routerProductColorSize);
app.use('/api/product-images', routerProductImage);
app.use('/api/product-product-promotions', routerProductPromotion);
app.use('/api/product-promotions', routerPromotion);
app.use('/api/orders', routerOrder);
app.use('/api/orderitems', routerOrderItem);
app.use('/api/gender', routerGender);
app.use('/api/sizes', routerSize);
app.use('/api/sizesType', routerSizeType);
app.use('/api', paymentRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/jibbitz', jibbitzRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json('API DAO SEMESTRAL WORK');
});



// Porta do servidor
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const environment = new paypal.core.SandboxEnvironment('AerA9zAAOphDi3X_h8qYVVrKhKLDSbnI0YNH_CsgcPmV5uQOB5zaq-MH5QgLiGgsLYUm0KplpHV8OJoF', 'EPpS6S2sZ6vQx6TufxeoMxhmXkr4Q9CIllVyjqxcdU3GnxCA3yijNhHlD5xZ-LOHKNX3ZRX2c7LV8N4Y');
const client = new paypal.core.PayPalHttpClient(environment);

app.post('/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: '10.00',
        },
      },
    ],
  });

  const response = await client.execute(request);
  res.json({ id: response.result.id });
});

// ================= MPESA =================
app.post('/api/mpesa/pay', async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    const parsedAmount = Number(amount);
    const sanitizedPhone = String(phoneNumber || '').replace(/\D/g, '');

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || sanitizedPhone.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos para M-Pesa',
        details: {
          amount,
          phoneNumber,
        },
      });
    }

    const result = await mpesaService.pagamentoMpesa(parsedAmount, sanitizedPhone);

    if (!result?.success) {
      const statusCode = result?.cause_code === 'UND_ERR_CONNECT_TIMEOUT' ? 504 : 502;
      return res.status(statusCode).json(result);
    }

    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro no pagamento' });
  }
});

app.post('/capture-order', async (req, res) => {
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  const response = await client.execute(request);
  res.json(response.result);
});
