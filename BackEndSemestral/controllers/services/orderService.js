import db from '../../models/index.js';
import { Op, col } from 'sequelize';

const {
  Order,
  OrderItem,
  PromotionSale,
  ProductColorSize,
  Promotion,
  ProductPromotion,
  sequelize
} = db;

export const processOrder = async (customer, cart, paymentMethod) => {
  const transaction = await sequelize.transaction();

  try {
    console.log("=== INÍCIO DO PEDIDO ===");
    console.log("Cliente:", customer);
    console.log("Carrinho:", cart);
    console.log("Método de pagamento:", paymentMethod);

    let totalAmount = 0;
    let totalDiscount = 0;

    // 1️⃣ Criar pedido
    const order = await Order.create({
      user_id: customer.id,
      order_date: new Date(),
      status: 'pending_payment',
      total_amount: 0,
      payment_method: paymentMethod,
      customer_name: `${customer.deliveryInfo.first_name} ${customer.deliveryInfo.last_name}`,
      address: customer.deliveryInfo.address1,
      city: customer.deliveryInfo.city,
      province: customer.deliveryInfo.province,
      postal_code: customer.deliveryInfo.postal_code,
      phone: customer.deliveryInfo.phone,
      country: customer.deliveryInfo.country,
      subtotal: 0,
      discount_amount: 0
    }, { transaction });

    // 2️⃣ Processar cada item do carrinho
    for (const item of cart) {
      const quantity = Number(item.quantity);
      if (quantity <= 0) throw new Error("Quantidade inválida");

      // Buscar SKU real para validação de stock
      const pcs = await ProductColorSize.findByPk(item.product_color_size_id, { transaction });
      if (!pcs) throw new Error("Produto não encontrado");

      if (pcs.stock_quantity < quantity)
        throw new Error(`Stock insuficiente para SKU ${item.sku || pcs.product_color_size_id}`);

      // Preço real: se houver promoção, pegar promo_price, senão base_price
      const basePrice = Number(item.base_price || 0);
      if (basePrice <= 0) throw new Error("Preço inválido para produto " + item.product_color_size_id);

      let unitPrice = basePrice;
      let discountAmount = 0;

      // 3️⃣ Verificar se há promoção
      let promo = null;
      if (item.is_on_promotion && item.promotion_id) {
        promo = await Promotion.findOne({
          where: {
            promotion_id: item.promotion_id,
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() },
            [Op.or]: [
              { promo_stock_limit: null },
              { promo_stock_used: { [Op.lt]: col('promo_stock_limit') } }
            ]
          },
          include: [{
            model: ProductPromotion,
            where: { product_color_size_id: pcs.product_color_size_id },
            required: true
          }],
          transaction
        });

        if (promo) {
          unitPrice = Number(item.promo_price);
          discountAmount = (basePrice - unitPrice) * quantity;

          await promo.increment('promo_stock_used', { by: quantity, transaction });
        }
      }

      totalAmount += unitPrice * quantity;
      totalDiscount += discountAmount;

      // 4️⃣ Criar item do pedido
      await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        product_color_size_id: pcs.product_color_size_id,
        color_id: item.product_color_id,
        quantity,
        unit_price: unitPrice,
        base_price: basePrice,
        discount_amount: discountAmount,
        promotion_id: promo ? promo.promotion_id : null,
        promotion_name: promo ? promo.name : null
      }, { transaction });

      // 5️⃣ Registrar venda promocional
      if (promo) {
        await PromotionSale.create({
          promotion_id: promo.promotion_id,
          order_id: order.order_id,
          product_color_size_id: pcs.product_color_size_id,
          quantity,
          base_price: basePrice,
          promo_price: unitPrice,
          discount_value: discountAmount,
          sold_at: new Date(),
          payment_method: paymentMethod,
          customer_phone: customer.deliveryInfo.phone
        }, { transaction });
      }

      // 6️⃣ Atualizar stock real
      pcs.stock_quantity -= quantity;
      await pcs.save({ transaction });
    }

    // 7️⃣ Atualizar totals do pedido
    order.subtotal = totalAmount + totalDiscount;
    order.discount_amount = totalDiscount;
    order.total_amount = totalAmount;

    await order.save({ transaction });
    await transaction.commit();

    console.log("=== PEDIDO CONCLUÍDO ===", order.order_id);

    return {
      order_id: order.order_id,
      total_amount: order.total_amount,
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      status: order.status
    };

  } catch (error) {
    await transaction.rollback();
    console.error("❌ ERRO NO PEDIDO:", error);
    throw error;
  }
};
