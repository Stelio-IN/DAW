import db from "../../models/index.js";
import { processCrocsOrderItem } from "./CrocsOrderItem.js";
import { processJibbitzOrderItem } from "./JibbitzOrderitem.js";

const { Order, sequelize } = db;

export const processOrder = async (customer, cart, paymentMethod) => {
  const transaction = await sequelize.transaction();

  try {
    let subtotal = 0;
    let total = 0;
    let discount = 0;

    /* ===============================
       🔹 CRIAR PEDIDO
    =============================== */
    const order = await Order.create(
      {
        user_id: customer.id,
        order_date: new Date(),
        status: "PENDING",
        subtotal: 0,
        discount_amount: 0,
        total_amount: 0,
        payment_method: paymentMethod,
        payment_status: "PENDING",

        customer_name: `${customer.deliveryInfo.first_name} ${customer.deliveryInfo.last_name}`,
        phone: customer.deliveryInfo.phone,
        address: customer.deliveryInfo.address1,
        city: customer.deliveryInfo.city,
        province: customer.deliveryInfo.province,
        postal_code: customer.deliveryInfo.postal_code,
        country: customer.deliveryInfo.country,
      },
      { transaction }
    );

    /* ===============================
       🔹 PROCESSAR ITENS
    =============================== */
    for (const item of cart) {
      let result;

      if (item.type === "product") {
        result = await processCrocsOrderItem({
          item,
          order,
          customer,
          paymentMethod,
          transaction,
        });
      }

      if (item.type === "jibbitz") {
        result = await processJibbitzOrderItem({
          item,
          order,
          customer,
          paymentMethod,
          transaction,
        });
      }

      if (!result) {
        throw new Error("Tipo de item não suportado");
      }

      subtotal += result.subtotal;
      total += result.total;
      discount += result.discount;
    }

    /* ===============================
       🔹 FINALIZAR PEDIDO
    =============================== */
    order.subtotal = subtotal;
    order.discount_amount = discount;
    order.total_amount = total;

    await order.save({ transaction });
    await transaction.commit();

    return {
      order_id: order.order_id,
      subtotal,
      discount_amount: discount,
      total_amount: total,
      status: order.status,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
