import db from "../../models/index.js";
import { Op, col, Sequelize } from "sequelize";

const {
  OrderItem,
  PromotionSale,
  ProductColorSize,
  Promotion,
  ProductPromotion,
  sequelize,
} = db;

/**
 * Processa UM item Crocs dentro de um pedido
 * Mantendo assinatura do "atual", mas agora bloqueia compra se quantidade exceder promo limit
 */
export const processCrocsOrderItem = async ({
  item,
  order,
  customer,
  paymentMethod,
  transaction,
}) => {
  console.log("OS DADOS ITEM:", item);

  const quantity = Number(item.quantity);
  if (quantity <= 0) throw new Error("Quantidade inválida");

  // 🔹 Bloqueio do stock para evitar double-spend
  const pcs = await ProductColorSize.findByPk(item.product_color_size_id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!pcs) throw new Error("Produto não encontrado");
  if (pcs.stock_quantity < quantity) throw new Error("Stock insuficiente");

  // 🔹 PREÇOS
  let unitPrice = Number(item.base_price);
  let basePrice = Number(item.price);
  let promo = null;

  const discountPercentage = item.discount_percentage
    ? Number(item.discount_percentage) / 100
    : 0;

  let totalSemPromocao = unitPrice * quantity;
  let totalComPromocao = basePrice * quantity;
  let totalDiscount = totalSemPromocao - totalComPromocao;

  // 🔹 PROMOÇÃO
  if (item.is_on_promotion && item.promotion_id) {
    promo = await Promotion.findOne({
      where: {
        promotion_id: item.promotion_id,
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() },
        [Op.or]: [
          { promo_stock_limit: null },
          { promo_stock_used: { [Op.lt]: col("promo_stock_limit") } },
        ],
      },
      include: [
        {
          model: ProductPromotion,
          as: "product_promotions",
          required: true,
          where: {
            [Op.or]: [
              { product_color_size_id: pcs.product_color_size_id },
              { product_color_id: pcs.product_color_id },
              { product_id: item.product_id },
            ],
          },
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    
    if (promo) {
      const promoLimit = item.promo_stock_limit ?? null;
      const promoUsed = item.promo_stock_used ?? 0;

      // 🔹 Bloquear compra se quantidade exceder promo stock limit
      if (promoLimit !== null && promoUsed + quantity > promoLimit) {
        throw new Error(
          `Quantidade solicitada (${quantity}) excede o limite promocional. Apenas ${promoLimit - promoUsed} unidades disponíveis com preço promocional.`
        );
      }

      // Aplicar preço promocional
      basePrice = Number(item.promo_price);
      totalComPromocao = basePrice * quantity;
      totalDiscount = totalSemPromocao - totalComPromocao;

      // Incrementar promo stock usado
      await Promotion.update(
        {
          promo_stock_used: Sequelize.literal(
            `COALESCE(promo_stock_used, 0) + ${quantity}`
          ),
        },
        { where: { promotion_id: item.promotion_id }, transaction }
      );

      // Se atingir limite, encerra promoção
      if (promoLimit !== null && promoUsed + quantity >= promoLimit) {
        await Promotion.update(
          { end_date: new Date() },
          { where: { promotion_id: item.promotion_id }, transaction }
        );
      }
    }
  }

  // 🔹 CUSTOS
  const custoUnidade = Number(pcs.cost_price);
  const custoTotal = custoUnidade * quantity;

  // 🔹 CRIAR ORDER ITEM
  await OrderItem.create(
    {
      order_id: order.order_id,
      product_id: item.product_id,
      product_color_size_id: pcs.product_color_size_id,
      color_id: item.product_color_id,
      quantity,

      unit_price: unitPrice,
      base_price: basePrice,

      discount_percentage: discountPercentage,
      discount_amount: totalDiscount,
      total_discount: totalDiscount,

      total_sem_promocao: item.promotion_id ? 0: totalSemPromocao,
      total_com_promocao: item.promotion_id ? totalComPromocao : 0,

      custo_unidade: custoUnidade,
      custo_total: custoTotal,

      promotion_id: item.promotion_id || 0,
      promotion_name: item.promotion_name || null,

      lucro_sem_promocao:  item.promotion_id ? 0: totalSemPromocao - custoTotal,
      lucro_com_promocao: item.promotion_id ? totalComPromocao - custoTotal : 0,

      name: item.name,
      color: item.color,
      hex_code: item.hex_code,
      size: item.size,
      size_type: item.size_type,
      image_url: item.image_url,
    },
    { transaction }
  );

  // 🔹 REGISTO DE VENDA PROMOCIONAL
  if (item.promotion_id) {
    await PromotionSale.create(
      {
        promotion_id: item.promotion_id,
        order_id: order.order_id,

        product_id: item.product_id,
        product_color_id: item.product_color_id ?? null,
        product_color_size_id: item.product_color_size_id ?? null,

        quantity,
        base_price: unitPrice,
        promo_price: basePrice,
        discount_value: totalDiscount,
        sold_at: new Date(),
        payment_method: paymentMethod,
        customer_phone: customer.deliveryInfo.phone,
      },
      { transaction }
    );
  }

  // 🔹 ATUALIZAR STOCK DE FORMA SEGURA
  const updatedRows = await ProductColorSize.update(
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

  if (updatedRows[0] === 0) {
    throw new Error("Stock insuficiente ou produto já reservado");
  }

  // 🔹 RETORNO
  return {
    subtotal: totalSemPromocao,
    total: totalComPromocao,
    discount: totalDiscount,
  };
};
