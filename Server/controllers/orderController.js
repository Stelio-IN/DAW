import db from '../models/index.js';
const Order = db.Order;

import { processOrder } from './services/orderService.js';

/*const createOrder = async (req, res) => {
  try {
    const { customer, cart, paymentMethod } = req.body;

    const result = await processOrder(customer, cart, paymentMethod);

    res.status(201).json({
      message: 'Pedido criado com sucesso!',
      order: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/

const createOrder = async (req, res) => {
  try {
    const { customer, cart, paymentMethod } = req.body;

    // Para teste, não chamamos nenhuma API externa
    // Só simulamos que o pagamento foi concluído
    const result = await processOrder(customer, cart, paymentMethod);

    // Simula que o pagamento foi bem sucedido
    // Atualizamos o status do pedido para 'paid' apenas para teste
    // await Order.update({ status: 'paid' }, { where: { order_id: result.order_id } });

    res.status(201).json({
      message: 'Pedido criado com sucesso! (teste sem pagamento real)',
      order: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { order_id: req.params.id },
    });
    if (updated) {
      const updatedOrder = await Order.findByPk(req.params.id);
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({
      where: { order_id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: 'Order deleted' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default{
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};