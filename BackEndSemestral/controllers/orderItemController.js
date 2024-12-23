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

export default {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem
};
