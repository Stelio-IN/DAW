// routes/paymentRoutes.js
import express from 'express';
import paypal from '@paypal/checkout-server-sdk';

const router = express.Router();


// paypal
const environment = new paypal.core.SandboxEnvironment(
    'AeqHhzKjUTSwvliDMKisOV8up3ylSUw7uNGESVORC0DJxIHz9ZmC0Atg7cFIM-ihdtscWCuREUweiBJi',
    'EEylRRspZN6KYDPQfoLBXPyXFTZuB-IvTrft_UYD78JHlNjqlsLsIf7RSVcaz4sBs9wE9aidQwiOZadA'
  );
  const client = new paypal.core.PayPalHttpClient(environment);
  
  // Atualize a rota /create-order
router.post('/create-order', async (req, res) => {
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
    console.error("Erro ao criar ordem do PayPal:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao processar o pagamento." });
  }
  
});

  
router.post('/capture-order', async (req, res) => {
  const { orderID, userID, products, enderecoEntrega } = req.body;

 
  console.log("Requisição recebida:", req.body); // Verifique todos os dados recebidos
  if (!orderID) {
    return res.status(400).json({ error: "orderID é necessário." });
  }

  try {
    // Captura a ordem no PayPal
    console.log(`Tentando capturar o pedido com orderID: ${orderID}`);
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const response = await client.execute(request);

    console.log("Resposta da captura do PayPal:", response);

    if (response.result.status === "COMPLETED") {
      // Detalhes do pagamento
      const totalPago = parseFloat(response.result.purchase_units[0].amount.value);
      const transacaoID = response.result.id;
      const estado = response.result.status;
      const metodoPagamento = "PayPal"; // Ou ajuste conforme necessário
      const dataPagamento = new Date(); // Data atual

      console.log("Inserindo pagamento no banco de dados...");
      // Inserir no histórico de pagamentos
      const pagamentoQuery = `
        INSERT INTO payments (user_id, total_pago, estado, metodo_pagamento, data_pagamento, transacao_id, endereco_entrega)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING pagamento_id;
      `;
      const pagamentoResult = await pool.query(pagamentoQuery, [
        userID,
        totalPago,
        estado,
        metodoPagamento,
        dataPagamento,
        transacaoID,
        enderecoEntrega,
      ]);
      const pagamentoID = pagamentoResult.rows[0].pagamento_id;


      console.log("Inserindo itens do pedido no banco de dados...");
      // Inserir os itens comprados no histórico de itens do pedido
      const orderItemsQuery = `
        INSERT INTO order_items (pagamento_id, producto_id, nome_produto, quantidade, preco_unitario, preco_total)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
      const insertItemPromises = products.map(async (product) => {
        const precoTotal = product.quantity * product.price;
        await pool.query(orderItemsQuery, [
          pagamentoID,
          product.id,
          product.name,
          product.quantity,
          product.price,
          precoTotal,
        ]);
      });

      // Aguarda todas as inserções
      await Promise.all(insertItemPromises);

      res.json({ message: "Compra registrada com sucesso!" });
    } else {
      console.error("Erro na captura do pagamento:", response.result);
      res.status(400).json({ error: "Erro na captura do pagamento." });
    }
  } catch (error) {
    console.error("Erro ao registrar pagamento:", error);
    console.error("Detalhes do erro:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao processar a compra." });
  }
});

export default router;