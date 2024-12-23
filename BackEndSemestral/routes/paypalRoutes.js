import express from 'express';
import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();


// Configuração do ambiente PayPal
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
  );
  
  const client = new paypal.core.PayPalHttpClient(environment);


const router = express.Router();

// Criar pedido
router.post('/create-order', async (req, res) => {
  const { total } = req.body; // Recebe o valor total do frontend

  if (!total || total <= 0) {
    return res.status(400).json({ error: 'Valor inválido para pagamento.' });
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
    res.json({ id: response.result.id }); // Retorna o ID do pedido
  } catch (error) {
    console.error('Erro ao criar ordem do PayPal:', error);
    res.status(500).json({ error: 'Erro ao processar o pagamento.' });
  }
});

// Capturar pedido
router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body;

  if (!orderID) {
    return res.status(400).json({ error: 'O ID do pedido é necessário.' });
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  try {
    const response = await client.execute(request);
    res.json(response.result); // Retorna o resultado da captura do pedido
  } catch (error) {
    console.error('Erro ao capturar ordem do PayPal:', error);
    res.status(500).json({ error: 'Erro ao processar a captura do pagamento.' });
  }
});

export default router;
