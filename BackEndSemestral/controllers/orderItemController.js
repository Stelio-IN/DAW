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

const getOrderDetails = async (req, res) => {
  try {
    // 🔐 USER VINDO DO AUTH STORAGE (TOKEN)
    const userId = req.user.user_id;
    console.log("🆔 userId (TOKEN):", userId);

    /**
     * 1️⃣ BUSCAR PEDIDOS DO USUÁRIO
     */
    const orders = await db.sequelize.query(
      `
      SELECT
        o.order_id,
        o.user_id,
        o.order_date,
        o.status,
        o.payment_method,
        o.payment_status,
        o.subtotal,
        o.discount_amount,
        o.shipping_amount,
        o.total_amount,
        o.customer_name
      FROM orders o
      WHERE o.user_id = :userId
      ORDER BY o.order_date DESC
      `,
      {
        replacements: { userId },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    console.log("📦 ORDERS:", orders);

    if (!orders.length) {
      return res.json([]);
    }

    const orderIds = orders.map(o => o.order_id);

    /**
     * 2️⃣ PRODUTOS (CROCS) — MODELO CORRETO
     */
    const products = await db.sequelize.query(
      `
      SELECT
        oi.order_id,
        oi.order_item_id,

        p.product_id,
        p.name AS product_name,

        col.name AS color_name,
        col.hex_code,

        s.size,

        oi.quantity,
        oi.base_price,
        oi.unit_price,
        oi.total_sem_promocao,
        oi.total_com_promocao,
        oi.discount_percentage,
        oi.total_discount,
        oi.promotion_name,

        pi.image_url AS primary_image_url

      FROM orderitems oi

      -- VARIANTE (CHAVE REAL)
      INNER JOIN product_color_sizes pcs
        ON pcs.product_color_size_id = oi.product_color_size_id

      INNER JOIN productcolors pc
        ON pc.product_color_id = pcs.product_color_id

      INNER JOIN products p
        ON p.product_id = pc.product_id

      INNER JOIN colors col
        ON col.color_id = pc.color_id

      INNER JOIN sizes s
        ON s.size_id = pcs.size_id

      -- IMAGEM (SIZE > COLOR)
      LEFT JOIN productimages pi
        ON pi.product_color_id = pc.product_color_id
       AND pi.is_primary = 1

      WHERE oi.order_id IN (:orderIds)
      `,
      {
        replacements: { orderIds },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    console.log("👟 PRODUCTS (CROCS):", products);

    /**
     * 3️⃣ JIBBITZ
     */
    const jibbitz = await db.sequelize.query(
      `
      SELECT
        joi.order_id,
        joi.id AS order_item_id,

        j.jibbitz_id,
        j.name AS jibbitz_name,

        jc.name AS category_name,

        joi.quantity,
        joi.base_price,
        joi.promo_unit_price,
        joi.total_base_price,
        joi.total_promo_price,
        joi.discount_percentage,
        joi.discount_amount,
        joi.profit_without_promo,
        joi.profit_with_promo,

        ji.image_url AS primary_image_url

      FROM jibbitz_order_items joi

      INNER JOIN jibbitz j
        ON j.jibbitz_id = joi.jibbitz_id

      INNER JOIN jibbitz_categories jc
        ON jc.category_id = j.category_id

      LEFT JOIN jibbitz_images ji
        ON ji.jibbitz_id = j.jibbitz_id
       AND ji.is_primary = 1

      WHERE joi.order_id IN (:orderIds)
      `,
      {
        replacements: { orderIds },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    console.log("🧩 JIBBITZ:", jibbitz);

    /**
     * 4️⃣ AGRUPAR POR PEDIDO
     */
    const response = orders.map(order => ({
      ...order,
      items: {
        products: products.filter(p => p.order_id === order.order_id),
        jibbitz: jibbitz.filter(j => j.order_id === order.order_id),
      },
    }));

    console.log("✅ RESPONSE FINAL:", JSON.stringify(response, null, 2));

    return res.json(response);

  } catch (error) {
    console.error("❌ Erro ao buscar pedidos:", error);
    return res.status(500).json({ error: error.message });
  }
};


export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getOrderDetails
};
