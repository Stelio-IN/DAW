import db from "../../models/index.js";
import { Op, Sequelize } from "sequelize";

const {
  Jibbitz,
  JibbitzStock, // ✅ ADICIONADO
  JibbitzOrderItem,
  JibbitzPromotion,
  JibbitzPromotionSale,
} = db;

/**
 * Processa UM item jibbitz dentro de um pedido
 */
export const processJibbitzOrderItem = async ({
  item,
  order,
  customer,
  paymentMethod,
  transaction,
}) => {
  console.log("🔵 PROCESSANDO JIBBITZ ITEM:", JSON.stringify(item, null, 2));
  console.log("🔵 PROCESSANDO JIBBITZ ORDEM:", order);
  console.log("🔵 PROCESSANDO JIBBITZ ORDEMMM:", item);

  const quantity = Number(item.quantity);

  if (!item.jibbitz_id) {
    throw new Error("Jibbitz inválido (jibbitz_id ausente)");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Quantidade inválida para jibbitz");
  }

  // 🔹 Buscar jibbitz (fonte da verdade)
  const jibbitz = await Jibbitz.findByPk(item.jibbitz_id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  console.log("🔵 PROCESSANDO JIBBITZ ORDEMMMMMMM :", jibbitz);

  if (!jibbitz) {
    throw new Error("Jibbitz não encontrado");
  }

  // 🔹 🔥 ADICIONADO — Buscar e validar stock
  const stock = await JibbitzStock.findOne({
    where: { jibbitz_id: item.jibbitz_id },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!stock) {
    throw new Error("Stock do jibbitz não encontrado");
  }

  if (stock.stock_quantity < quantity) {
    throw new Error(
      `Stock insuficiente. Disponível: ${stock.stock_quantity}`
    );
  }

  const unitBasePrice = Number(jibbitz.price); // preço original
  const PromoUnitPrice = Number(item.price); // preço enviado pelo carrinho
  const isOnPromotion = Boolean(item.is_on_promotion);
  let promotion = null;

  console.log("💰 PREÇOS RECEBIDOS:", {
    base_db: unitBasePrice,
    price_cart: PromoUnitPrice,
    is_on_promotion: isOnPromotion,
    promotion_id: item.promotion_id,
  });

  if (PromoUnitPrice > unitBasePrice) {
    throw new Error("Preço final maior que o preço base");
  }

  const totalBasePrice = unitBasePrice * quantity;
  const totalPromoPrice = PromoUnitPrice * quantity;
  const discountValue = totalBasePrice - totalPromoPrice;

  // 🔹 Pegar o custo
  const unitCost = Number(item.unit_cost || 0);
  const totalCost = unitCost * quantity;

  console.log("O CUSTO", unitCost);
  console.log("📊 CÁLCULOS DE PREÇO:", {
    unitBasePrice,
    PromoUnitPrice,
    totalBasePrice,
    totalPromoPrice,
    discountValue,
  });

  // 🔹 🔥 ADICIONADO — Descontar stock (ATÔMICO)
  await JibbitzStock.update(
    {
      stock_quantity: Sequelize.literal(`stock_quantity - ${quantity}`),
    },
    {
      where: { jibbitz_id: item.jibbitz_id },
      transaction,
    }
  );

  // 🔹 Obter promoção se aplicável
  if (isOnPromotion && item.promotion_id) {
    promotion = await JibbitzPromotion.findByPk(item.promotion_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    console.log("🎯 PROMOÇÃO ENCONTRADA:", promotion?.promotion_id);

    if (!promotion) {
      throw new Error("Promoção de jibbitz inválida");
    }

    // Atualiza stock promocional
    await JibbitzPromotion.update(
      {
        promo_stock_used: Sequelize.literal(
          `promo_stock_used + ${quantity}`
        ),
      },
      {
        where: { promotion_id: promotion.promotion_id },
        transaction,
      }
    );
  }

  // 🔹 Calcular lucros
  const profitWithoutPromo = totalBasePrice - totalCost;
  const profitWithPromo = totalPromoPrice - totalCost;

  console.log("💹 CUSTOS E LUCROS:", {
    unitCost,
    totalCost,
    profitWithoutPromo,
    profitWithPromo,
  });

  console.log("💰 ITEM RECEBIDO NO BACKEND:", item);
if (stock.stock_quantity - quantity < 0) {
  throw new Error("Stock insuficiente antes do commit");
}

  // 🔹 Criar JibbitzOrderItem
  const orderItem = await JibbitzOrderItem.create(
    {
      order_id: order.order_id,
      jibbitz_id: item.jibbitz_id,
      quantity,

      // Preços
      base_price: unitBasePrice,
      total_base_price: totalBasePrice,
      promo_unit_price: PromoUnitPrice,
      total_promo_price: totalPromoPrice,

      // Promoção
      is_on_promotion: isOnPromotion,
      promotion_id: promotion?.promotion_id || null,
      discount_percentage: item.discount_percentage || null,
      discount_amount: discountValue,

      // Custos e lucros
      unit_cost: unitCost,
      total_cost: totalCost,
      profit_without_promo: profitWithoutPromo,
      profit_with_promo: profitWithPromo,
    },
    { transaction }
  );

  console.log("🧾 JIBBITZ ORDER ITEM CRIADO:", orderItem.id);

  // 🔹 Registrar venda promocional
  if (promotion) {
    await JibbitzPromotionSale.create(
      {
        promotion_id: promotion.promotion_id,
        order_id: order.order_id,
        jibbitz_id: item.jibbitz_id,
        quantity,
        base_price: unitBasePrice,
        promo_price: PromoUnitPrice,
        discount_value: discountValue,
        sold_at: new Date(),
      },
      { transaction }
    );

    console.log(
      "🎟️ VENDA PROMOCIONAL REGISTRADA:",
      promotion.promotion_id
    );
  }

  return {
    subtotal: totalBasePrice,
    total: totalPromoPrice,
    discount: discountValue,
  };
};
