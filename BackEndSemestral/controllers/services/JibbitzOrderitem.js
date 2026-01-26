import db from "../../models/index.js";
import { Op, Sequelize } from "sequelize";

const {
  Jibbitz,
  JibbitzStock,
  JibbitzOrderItem,
  JibbitzPromotion,
  JibbitzPromotionSale,
} = db;

/**
 * Processa UM item jibbitz dentro de um pedido
 * 🔹 Mantém a lógica atual, adicionando verificações para:
 *    - Bloquear venda se stock promocional for excedido
 *    - Evitar desconto de stock antes das validações
 */
export const processJibbitzOrderItem = async ({
  item,
  order,
  customer,
  paymentMethod,
  transaction,
}) => {
  console.log("🔵 PROCESSANDO JIBBITZ ITEM:", JSON.stringify(item, null, 2));

  const quantity = Number(item.quantity);
  if (!item.jibbitz_id) throw new Error("Jibbitz inválido (jibbitz_id ausente)");
  if (!quantity || quantity <= 0) throw new Error("Quantidade inválida para jibbitz");

  // 🔹 Buscar jibbitz (fonte da verdade)
  const jibbitz = await Jibbitz.findByPk(item.jibbitz_id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  if (!jibbitz) throw new Error("Jibbitz não encontrado");
  console.log("🔵 Jibbitz encontrado:", jibbitz.jibbitz_id, jibbitz.name);

  // 🔹 Buscar stock físico
  const stock = await JibbitzStock.findOne({
    where: { jibbitz_id: item.jibbitz_id },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  if (!stock) throw new Error("Stock do jibbitz não encontrado");
  console.log("📊 Stock atual:", stock.stock_quantity);

  if (stock.stock_quantity < quantity) {
    throw new Error(`Stock insuficiente. Disponível: ${stock.stock_quantity}`);
  }

  const unitBasePrice = Number(jibbitz.price); // preço original
  const PromoUnitPrice = Number(item.price); // preço enviado pelo carrinho
  const isOnPromotion = Boolean(item.is_on_promotion);
  let promotion = null;

  console.log("💰 PREÇOS RECEBIDOS:", {
    unitBasePrice,
    PromoUnitPrice,
    isOnPromotion,
    promotion_id: item.promotion_id,
  });

  if (PromoUnitPrice > unitBasePrice) throw new Error("Preço final maior que o preço base");

  const totalBasePrice = unitBasePrice * quantity;
  const totalPromoPrice = PromoUnitPrice * quantity;
  const discountValue = totalBasePrice - totalPromoPrice;

  const unitCost = Number(item.unit_cost || 0);
  const totalCost = unitCost * quantity;

  console.log("📊 Custos iniciais:", { unitCost, totalCost });

  // 🔹 VERIFICAR PROMOÇÃO E LIMITE DE STOCK PROMOCIONAL ANTES DE DESCONTAR STOCK
  if (isOnPromotion && item.promotion_id) {
    promotion = await JibbitzPromotion.findByPk(item.promotion_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!promotion) throw new Error("Promoção de jibbitz inválida");
    console.log("🎯 Promoção encontrada:", promotion.promotion_id);

    // 🔹 Bloqueio se quantidade exceder limite promocional
    if (promotion.promo_stock_limit !== null) {
      const availablePromoStock =
        (promotion.promo_stock_limit || 0) - (promotion.promo_stock_used || 0);
      console.log("📊 Stock promocional disponível:", availablePromoStock);

      if (quantity > availablePromoStock) {
        throw new Error(
          `Quantidade solicitada excede limite da promoção. Apenas ${availablePromoStock} unidades disponíveis em promoção.`
        );
      }
    }
  }

  // 🔹 DESCONTAR STOCK FÍSICO (após todas as validações)
  console.log("🔹 Descontando stock físico...");
  const updatedRows = await JibbitzStock.update(
    { stock_quantity: Sequelize.literal(`stock_quantity - ${quantity}`) },
    {
      where: { jibbitz_id: item.jibbitz_id, stock_quantity: { [Sequelize.Op.gte]: quantity } },
      transaction,
    }
  );
  if (updatedRows[0] === 0) throw new Error("Stock insuficiente ou já reservado");
  console.log("✅ Stock físico atualizado com sucesso");

  // 🔹 Atualizar stock promocional se houver promoção
  if (promotion) {
    console.log("🔹 Incrementando promo_stock_used...");
    await JibbitzPromotion.update(
      { promo_stock_used: Sequelize.literal(`COALESCE(promo_stock_used, 0) + ${quantity}`) },
      { where: { promotion_id: promotion.promotion_id }, transaction }
    );

    const promoLimit = promotion.promo_stock_limit ?? null;
    const promoUsed = promotion.promo_stock_used ?? 0;
    if (promoLimit !== null && promoUsed + quantity >= promoLimit) {
      console.log("🔹 Promoção atingiu limite, encerrando...");
      await JibbitzPromotion.update(
        { end_date: new Date() },
        { where: { promotion_id: promotion.promotion_id }, transaction }
      );
    }
  }

  const promoUnitPriceFinal = isOnPromotion ? PromoUnitPrice : 0;
const totalPromoPriceFinal = isOnPromotion ? totalPromoPrice : 0;
const profitWithPromoFinal = isOnPromotion
  ? totalPromoPrice - totalCost
  : 0;

const discountAmountFinal = isOnPromotion ? discountValue : 0;
const discountPercentageFinal = isOnPromotion
  ? item.discount_percentage || 0
  : 0;

  // 🔹 Criar JibbitzOrderItem
  const orderItem = await JibbitzOrderItem.create(
  {
    order_id: order.order_id,
    jibbitz_id: item.jibbitz_id,
    quantity,

    // 🔹 Preço base (sempre)
    base_price: unitBasePrice,
    total_base_price: totalBasePrice,

    // 🔹 Promoção (somente se houver)
    promo_unit_price: promoUnitPriceFinal,
    total_promo_price: totalPromoPriceFinal,
    profit_with_promo: profitWithPromoFinal,

    is_on_promotion: isOnPromotion,
    promotion_id: promotion?.promotion_id || null,
    discount_percentage: discountPercentageFinal,
    discount_amount: discountAmountFinal,

    // 🔹 Custos e lucro normal (sempre)
    unit_cost: unitCost,
    total_cost: totalCost,
    profit_without_promo: totalBasePrice - totalCost,
  },
  { transaction }
);

console.log("🧾 JibbitzOrderItem criado:", orderItem.id);

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
    console.log("🎟️ Venda promocional registrada:", promotion.promotion_id);
  }

  console.log("✅ Processamento do item jibbitz finalizado");
  return {
    subtotal: totalBasePrice,
    total: totalPromoPrice,
    discount: discountValue,
  };
};
