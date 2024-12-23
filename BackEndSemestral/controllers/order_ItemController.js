import db from "../models/index.js";
const OrderItem = db.OrderItem;

const createOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.create(req.body);
    res.status(201).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) {
      res.status(200).json(orderItem);
    } else {
      res.status(404).json({ message: "OrderItem not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderItem = async (req, res) => {
  try {
    const [updated] = await OrderItem.update(req.body, {
      where: { order_item_id: req.params.id },
    });
    if (updated) {
      const updatedOrderItem = await OrderItem.findByPk(req.params.id);
      res.status(200).json(updatedOrderItem);
    } else {
      res.status(404).json({ message: "OrderItem not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.destroy({
      where: { order_item_id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: "OrderItem deleted" });
    } else {
      res.status(404).json({ message: "OrderItem not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Novo método para obter o histórico de compras de um usuário
const getOrderHistoryByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [orders] = await db.sequelize.query(`
      SELECT 
          oi.order_item_id,
          oi.pagamento_id,
          oi.nome_produto,
          oi.quantidade,
          oi.preco_unitario,
          oi.preco_total,
          p.data_pagamento,
          p.total_pago
      FROM 
          order_items oi
      INNER JOIN 
          payments p ON oi.pagamento_id = p.pagamento_id
      WHERE 
          p.user_id = ?
      ORDER BY 
          p.payment_date DESC
    `, { replacements: [userId], type: db.Sequelize.QueryTypes.SELECT });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Erro ao obter histórico de pedidos:', error);
    res.status(500).json({ error: 'Erro ao obter histórico de pedidos' });
  }
};

export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
  getOrderHistoryByUser, // Novo método exportado
};
