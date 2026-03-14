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

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [order] = await db.sequelize.query(
      `
      SELECT *
      FROM \`order\`
      WHERE order_id = :orderId
      `,
      {
        replacements: { orderId },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const products = await db.sequelize.query(
      `
      SELECT
        oi.order_item_id,
        p.name AS product_name,
        c.name AS color_name,
        pcs.size,
        oi.quantity,
        oi.base_price,
        oi.unit_price,
        oi.total_sem_promocao,
        oi.total_com_promocao,
        oi.total_discount,
        oi.promotion_name,
        oi.discount_percentage,
        oi.lucro_sem_promocao,
        oi.lucro_com_promocao
      FROM orderitems oi
      INNER JOIN products p ON p.product_id = oi.product_id
      INNER JOIN colors c ON c.color_id = oi.color_id
      INNER JOIN product_color_sizes pcs 
        ON pcs.product_color_size_id = oi.product_color_size_id
      WHERE oi.order_id = :orderId
      `,
      {
        replacements: { orderId },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const jibbitz = await db.sequelize.query(
      `
      SELECT
        joi.id,
        j.name AS jibbitz_name,
        joi.quantity,
        joi.base_price,
        joi.total_base_price,
        joi.promo_unit_price,
        joi.total_promo_price,
        joi.discount_percentage,
        joi.discount_amount,
        joi.profit_without_promo,
        joi.profit_with_promo
      FROM jibbitz_order_items joi
      INNER JOIN jibbitz j ON j.jibbitz_id = joi.jibbitz_id
      WHERE joi.order_id = :orderId
      `,
      {
        replacements: { orderId },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      order,
      items: {
        products,
        jibbitz,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes do pedido:", error);
    res.status(500).json({ error: error.message });
  }
};


export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
  getOrderHistoryByUser,
  getOrderDetails, 
};
