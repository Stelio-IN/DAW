import db from "../../models/index.js";
import { Op, Sequelize } from "sequelize";

const {
  OrderItem,
  PromotionSale,
  ProductColorSize,
  Promotion,
} = db;

export const processCrocsOrderItem = async ({
  item,
  order,
  customer,
  paymentMethod,
  transaction,
}) => {

    console.log('os dados', item)
    console.log('os dados', order)
    console.log('os dados', customer)
    console.log('os dados', paymentMethod)
    console.log('os dados', transaction)
  const quantity = Number(item.quantity);
  if (quantity <= 0) throw new Error("Quantidade inválida");

  const pcs = await ProductColorSize.findByPk(item.product_color_size_id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!pcs) throw new Error("Produto não encontrado");
  if (pcs.stock_quantity < quantity) throw new Error("Stock insuficiente");

  /* ===============================
     🔹 PREÇOS
  =============================== */
  const unitBasePrice = Number(item.base_price);
  let finalUnitPrice = Number(item.price);

  const totalBasePrice = unitBasePrice * quantity;
  const totalFinalPrice = finalUnitPrice * quantity;
  const discountValue = totalBasePrice - totalFinalPrice;

  /* ===============================
     🔹 PROMOÇÃO
  =============================== */
  if (item.is_on_promotion && item.promotion_id) {
    const promoUsed = Number(item.promo_stock_used || 0);
    const promoLimit =
      item.promo_stock_limit !== null
        ? Number(item.promo_stock_limit)
        : null;

    if (promoLimit !== null && promoUsed + quantity > promoLimit) {
      throw new Error("Stock promocional esgotado");
    }

    await Promotion.update(
      {
        promo_stock_used: Sequelize.literal(
          `COALESCE(promo_stock_used, 0) + ${quantity}`
        ),
      },
      { where: { promotion_id: item.promotion_id }, transaction }
    );

    if (promoLimit !== null && promoUsed + quantity >= promoLimit) {
      await Promotion.update(
        { end_date: new Date() },
        { where: { promotion_id: item.promotion_id }, transaction }
      );
    }
  }

  /* ===============================
     🔹 ORDER ITEM
  =============================== */
  await OrderItem.create(
    {
      order_id: order.order_id,
      product_id: item.product_id,
      product_color_size_id: pcs.product_color_size_id,
      color_id: item.product_color_id,
      quantity,

      unit_price: unitBasePrice,
      base_price: finalUnitPrice,

      total_sem_promocao: totalBasePrice,
      total_com_promocao: item.is_on_promotion ? totalFinalPrice : 0,

      name: item.name,
      color: item.color,
      hex_code: item.hex_code,
      size: item.size,
      size_type: item.size_type,
      image_url: item.image_url,

      promotion_id: item.promotion_id || null,
    },
    { transaction }
  );

  /* ===============================
     🔹 REGISTO PROMO
  =============================== */
  if (item.promotion_id) {
    await PromotionSale.create(
      {
        promotion_id: item.promotion_id,
        order_id: order.order_id,

        product_id: item.product_id,
        product_color_id: item.product_color_id,
        product_color_size_id: item.product_color_size_id,

        quantity,
        base_price: unitBasePrice,
        promo_price: finalUnitPrice,
        discount_value: discountValue,
        sold_at: new Date(),
        payment_method: paymentMethod,
        customer_phone: customer.deliveryInfo.phone,
      },
      { transaction }
    );
  }

  /* ===============================
     🔹 STOCK
  =============================== */
  const updated = await ProductColorSize.update(
    {
      stock_quantity: Sequelize.literal(`stock_quantity - ${quantity}`),
    },
    {
      where: {
        product_color_size_id: pcs.product_color_size_id,
        stock_quantity: { [Op.gte]: quantity },
      },
      transaction,
    }
  );

  if (updated[0] === 0) {
    throw new Error("Stock insuficiente");
  }

  /* ===============================
     🔹 RETORNO
  =============================== */
  return {
    subtotal: totalBasePrice,
    total: totalFinalPrice,
    discount: discountValue,
  };
};
