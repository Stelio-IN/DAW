import express from 'express';
import dbConfig from '../config/db.js'; // Atualize o caminho para o arquivo db.js
import mysql from 'mysql2/promise';

const router = express.Router();

// Configuração da conexão com o banco de dados
const db = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  ...dbConfig.pool, // Configuração adicional do pool
});

// Rota para salvar os dados do pagamento e itens do pedido
router.post('/payments', async (req, res) => {
    const { payerName, payerEmail, totalUSD, orderId, cartItems } = req.body;
  
    // Validação inicial dos dados recebidos
    if (!payerName || !payerEmail || !totalUSD || !orderId || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Dados do pagamento ou itens do carrinho estão incompletos.' });
    }
  
    // Iniciar a transação
    const connection = await db.getConnection();
    await connection.beginTransaction();
  
    try {
      // 1. Inserir os dados do pagamento
      const [paymentResult] = await connection.query(
        'INSERT INTO paymentos (payer_name, payer_email, total_usd, order_id) VALUES (?, ?, ?, ?)',
        [payerName, payerEmail, totalUSD, orderId]
      );
      const pagamentoId = paymentResult.insertId;
  
      // 2. Inserir os itens do carrinho
      for (const item of cartItems) {

         // Mapeia os campos recebidos para os campos esperados no banco de dados
    let produto_id = item.product_id;
      let nome_produto = item.name;
      let quantidade = item.quantity;
     let preco_unitario = parseFloat(item.price); // Converte 'price' para número

        
  
        // Validação de cada item do carrinho
        if (
            !produto_id ||
            typeof produto_id !== 'number' ||
            !nome_produto ||
            typeof nome_produto !== 'string' ||
            typeof quantidade !== 'number' ||
            quantidade <= 0 ||
            isNaN(preco_unitario) ||
            preco_unitario <= 0
          ){
          throw new Error(`Item do carrinho inválido: ${JSON.stringify(item)}`);
        }
  
        const preco_total = preco_unitario * quantidade;
  
        await connection.query(
          'INSERT INTO compras (pagamento_id, produto_id, nome_produto, quantidade, preco_unitario, preco_total) VALUES (?, ?, ?, ?, ?, ?)',
          [pagamentoId, produto_id, nome_produto, quantidade, preco_unitario, preco_total]
        );
      }
  
      // Commit da transação
      await connection.commit();
      res.status(200).json({ message: 'Pagamento e itens registrados com sucesso!' });
    } catch (error) {
      // Rollback em caso de erro
      await connection.rollback();
      console.error('Erro ao registrar pagamento e itens:', error.message || error);
      res.status(500).json({ message: 'Erro ao registrar pagamento e itens.', error: error.message });
    } finally {
      // Liberar a conexão
      connection.release();
    }
  });
  

export default router;
