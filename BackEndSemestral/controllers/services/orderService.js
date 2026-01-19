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
    let orderTotalComPromocao = 0;
    let orderTotalSemPromocao = 0;
    let orderTotalDiscount = 0;

     console.log("=== INÍCIO DO PEDIDO ===");
    console.log("Cliente:", customer);
    console.log("Carrinho:", cart);
    console.log("Método de pagamento:", paymentMethod);

    // 1️⃣ Criar pedido
    const order = await Order.create({
      user_id: customer.id,
      order_date: new Date(),
      status: 'PENDING',
      subtotal: 0,
      discount_amount: 0,
      total_amount: 0,
      payment_method: paymentMethod,
      payment_status: 'PENDING',
      customer_name: `${customer.deliveryInfo.first_name} ${customer.deliveryInfo.last_name}`,
      phone: customer.deliveryInfo.phone,
      address: customer.deliveryInfo.address1,
      city: customer.deliveryInfo.city,
      province: customer.deliveryInfo.province,
      postal_code: customer.deliveryInfo.postal_code,
      country: customer.deliveryInfo.country
    }, { transaction });

    // 2️⃣ Processar carrinho
    for (const item of cart) {
      const quantity = Number(item.quantity);
      if (quantity <= 0) throw new Error('Quantidade inválida');

      const pcs = await ProductColorSize.findByPk(
        item.product_color_size_id,
        { transaction }
      );
      if (!pcs) throw new Error('Produto não encontrado');

      if (pcs.stock_quantity < quantity)
        throw new Error('Stock insuficiente');

      /* ===============================
         🔹 PREÇOS
      =============================== */
      const unitPrice = Number(item.base_price); // SEM promoção
      if (unitPrice <= 0) throw new Error('Preço inválido');

      const discountPercentage = item.discount_percentage
        ? Number(item.discount_percentage) / 100
        : 0;

      let basePrice = item.price; // COM promoção
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
            as: 'product_promotions',
            where: { product_color_size_id: pcs.product_color_size_id },
            required: true
          }],
          transaction
        });

        if (promo) {
          basePrice = Number(item.promo_price);
          await promo.increment('promo_stock_used', { by: quantity, transaction });
        }
      }

      /* ===============================
         🔹 CÁLCULOS (FÓRMULAS OFICIAIS)
      =============================== */
      const discountAmount = unitPrice * discountPercentage;
      const totalSemPromocao = unitPrice * quantity;
      const totalComPromocao = item.price * quantity;
      const totalDiscount = totalSemPromocao * discountPercentage;

      const custoUnidade = Number(pcs.cost_price);
      console.log("o custo do produto", custoUnidade)
      const custoTotal = custoUnidade * quantity;
      console.log("o custo do Total", custoTotal)

      /* ===============================
         🔹 ACUMULADORES DO PEDIDO
      =============================== */
      orderTotalSemPromocao += totalSemPromocao;
      orderTotalComPromocao += totalComPromocao;
      orderTotalDiscount += totalDiscount;

      /* ===============================
         🔹 ORDER ITEM
      =============================== */
      await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        product_color_size_id: pcs.product_color_size_id,
        color_id: item.product_color_id,
        quantity,

        unit_price: unitPrice,
        base_price: basePrice,

        discount_percentage: discountPercentage,
        discount_amount: discountAmount,
        total_discount: totalDiscount,

        total_sem_promocao: totalSemPromocao,
       total_com_promocao: item.promotion_id ? totalComPromocao : 0,

        custo_unidade: custoUnidade,
        custo_total: custoTotal,

        promotion_id: item.promotion_id || 0,
        promotion_name: item.name || null,

        lucro_sem_promocao: totalSemPromocao - custoTotal || 0,
        lucro_com_promocao: totalComPromocao - custoTotal || 0,

        name: item.name,
        color: item.color,
        hex_code: item.hex_code,
        size: item.size,
        size_type: item.size_type,
        image_url: item.image_url
      }, { transaction });

      /* ===============================
         🔹 REGISTO DE VENDA PROMOCIONAL
      =============================== */
      if (promo) {
        await PromotionSale.create({
          promotion_id: promo.promotion_id,
          order_id: order.order_id,
          product_color_size_id: pcs.product_color_size_id,
          quantity,
          base_price: unitPrice,
          promo_price: basePrice,
          discount_value: totalDiscount,
          sold_at: new Date(),
          payment_method: paymentMethod,
          customer_phone: customer.deliveryInfo.phone
        }, { transaction });
      }

      /* ===============================
         🔹 STOCK
      =============================== */
      pcs.stock_quantity -= quantity;
      await pcs.save({ transaction });
    }

    /* ===============================
       🔹 TOTAIS DO PEDIDO
    =============================== */
    order.subtotal = orderTotalSemPromocao;
    order.discount_amount = orderTotalDiscount;
    order.total_amount = orderTotalComPromocao;

    await order.save({ transaction });
    await transaction.commit();

    return {
      order_id: order.order_id,
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      total_amount: order.total_amount,
      status: order.status
    };

  } catch (error) {
    await transaction.rollback();
    console.error('❌ ERRO NO PEDIDO:', error);
    throw error;
  }
};
