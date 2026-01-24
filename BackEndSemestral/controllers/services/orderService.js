import db from "../../models/index.js";
import { Op, col } from "sequelize";

const {
  Order,
  OrderItem,
  PromotionSale,
  ProductColorSize,
  Promotion,
  ProductPromotion,
  sequelize,
} = db;

export const processOrder = async (customer, cart, paymentMethod) => {
  const transaction = await sequelize.transaction();

  try {
    console.log("==============================================");
    console.log("🚀 processOrder INICIADO");
    console.log("customer:", customer);
    console.log("typeof customer:", typeof customer);
    console.log("cart:", cart);
    console.log("cart.length:", cart?.length);
    console.log("paymentMethod:", paymentMethod);
    console.log("==============================================");

    let orderTotalComPromocao = 0;
    let orderTotalSemPromocao = 0;
    let orderTotalDiscount = 0;

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
      { transaction },
    );

    console.log("🧾 PEDIDO CRIADO:", order);

    /* ===============================
       🔹 PROCESSAR CARRINHO
    =============================== */
    for (const item of cart) {
      console.log("##############################################");
      console.log("🔁 ITEM DO CARRINHO (RAW):", item);

      const quantity = Number(item.quantity);
      console.log("📦 QUANTITY:", {
        raw: item.quantity,
        quantity,
        typeof: typeof quantity,
        isNaN: Number.isNaN(quantity),
      });

      if (quantity <= 0) throw new Error("Quantidade inválida");

      const pcs = await ProductColorSize.findByPk(item.product_color_size_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      console.log("🎨 PCS:", pcs);

      if (!pcs) throw new Error("Produto não encontrado");
      if (pcs.stock_quantity < quantity) throw new Error("Stock insuficiente");

      /* ===============================
         🔹 PREÇOS
      =============================== */
      const unitPrice = Number(item.base_price);
      console.log("💰 UNIT PRICE:", {
        unitPrice,
        typeof: typeof unitPrice,
        isNaN: Number.isNaN(unitPrice),
      });

      const discountPercentage = item.discount_percentage
        ? Number(item.discount_percentage) / 100
        : 0;

      console.log("📉 DISCOUNT:", {
        raw: item.discount_percentage,
        discountPercentage,
        typeof: typeof discountPercentage,
      });

      let basePrice = item.price;
      let promo = null;

      console.log("🎯 PROMO FLAGS:", {
        is_on_promotion: item.is_on_promotion,
        promotion_id: item.promotion_id,
      });

     if (item.is_on_promotion && item.promotion_id) {
  // 🔹 Usando promo_stock_used e promo_stock_limit do item do carrinho
  const promoUsed = Number(item.promo_stock_used || 0);
  const promoLimit = item.promo_stock_limit !== null ? Number(item.promo_stock_limit) : null;

  console.log("🔢 Limite e usado da promoção:", {
    promo_stock_used: promoUsed,
    promo_stock_limit: promoLimit,
    item_quantity: quantity,
    total_after_update: promoUsed + quantity
  });

  // Checar se há stock suficiente
  if (promoLimit !== null && promoUsed + quantity > promoLimit) {
    console.error("❌ Stock promocional insuficiente!");
    throw new Error("Stock promocional esgotado");
  }

  // 💰 Aplicar preço promocional
  basePrice = Number(item.promo_price);

  // 📦 Incrementar stock promocional de forma segura
  const [affectedRows] = await Promotion.update(
    {
      promo_stock_used: sequelize.literal(`COALESCE(promo_stock_used, 0) + ${quantity}`)
    },
    {
      where: { promotion_id: item.promotion_id },
      transaction,
    }
  );

  console.log("📊 Promoções afetadas na atualização:", affectedRows);
  // 🔹 Remover promoção se atingir limite
  if (promoLimit !== null && promoUsed + quantity >= promoLimit) {
    console.log(`⚠️ Promoção ${item.promotion_name} atingiu o limite e será desativada`);

    // Atualiza a promoção para não estar mais ativa
    await Promotion.update(
      { end_date: new Date() }, // encerra a promoção
      { where: { promotion_id: item.promotion_id }, transaction }
    );
  }
}


      /* ===============================
         🔹 CÁLCULOS
      =============================== */
      const discountAmount = unitPrice * discountPercentage;
      const totalSemPromocao = unitPrice * quantity;
      const totalComPromocao = item.price * quantity;
      const totalDiscount = totalSemPromocao * discountPercentage;

      console.log("📐 CÁLCULOS:", {
        discountAmount,
        totalSemPromocao,
        totalComPromocao,
        totalDiscount,
      });

      /* ===============================
         🔹 CUSTOS tualizar
      =============================== */
      const custoUnidade = Number(pcs.cost_price);
      const custoTotal = custoUnidade * quantity;

      console.log("🏭 CUSTOS:", {
        pcs_cost_price: pcs.cost_price,
        custoUnidade,
        custoTotal,
        isNaN_custoUnidade: Number.isNaN(custoUnidade),
        isNaN_custoTotal: Number.isNaN(custoTotal),
      });

      /* ===============================
         🔹 ACUMULADORES
      =============================== */
      orderTotalSemPromocao += totalSemPromocao;
      orderTotalComPromocao += totalComPromocao;
      orderTotalDiscount += totalDiscount;

      console.log("📊 ACUMULADORES:", {
        orderTotalSemPromocao,
        orderTotalComPromocao,
        orderTotalDiscount,
      });

      /* ===============================
         🔹 PAYLOAD FINAL
      =============================== */
      const orderItemPayload = {
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
        lucro_com_promocao: item.promotion_id
          ? totalComPromocao - custoTotal
          : 0,

        name: item.name,
        color: item.color,
        hex_code: item.hex_code,
        size: item.size,
        size_type: item.size_type,
        image_url: item.image_url,
      };

      console.log(
        "🧾 ORDER ITEM PAYLOAD:",
        JSON.stringify(orderItemPayload, null, 2),
      );

      await OrderItem.create(orderItemPayload, { transaction });

      /* ===============================
         🔹 REGISTO PROMO
      =============================== */
      if (item.promotion_id) {
        console.log("📝 REGISTAR PROMOTION SALE");
        await PromotionSale.create(
          {
            promotion_id: item.promotion_id,
            order_id: order.order_id,

            product_id: item.product_id,
            product_color_id: item.product_color_id ?? null,
            product_color_size_id: item.product_color_size_id ?? null,

            quantity,
            base_price: unitPrice,
            promo_price: item.price,
            discount_value: totalDiscount,
            sold_at: new Date(),
            payment_method: paymentMethod,
            customer_phone: customer.deliveryInfo.phone,
          },
          { transaction },
        );
      }

      /* ===============================
         🔹 STOCK
      =============================== */
      /* ===============================
   🔹 STOCK (ATÓMICO / SEGURO)
=============================== */
      const updatedRows = await ProductColorSize.update(
        {
          stock_quantity: sequelize.literal(`stock_quantity - ${quantity}`),
        },
        {
          where: {
            product_color_size_id: pcs.product_color_size_id,
            stock_quantity: { [Op.gte]: quantity },
          },
          transaction,
        },
      );

      if (updatedRows[0] === 0) {
        throw new Error("Stock insuficiente ou produto já reservado");
      }
    }

    /* ===============================
       🔹 FINALIZAR PEDIDO
    =============================== */
    order.subtotal = orderTotalSemPromocao;
    order.discount_amount = orderTotalDiscount;
    order.total_amount = orderTotalComPromocao;

    console.log("✅ TOTAIS FINAIS DO PEDIDO:", {
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      total_amount: order.total_amount,
    });

    await order.save({ transaction });
    await transaction.commit();

    console.log("🎉 processOrder FINALIZADO COM SUCESSO");

    return {
      order_id: order.order_id,
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      total_amount: order.total_amount,
      status: order.status,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("❌ ERRO NO PEDIDO:", error);
    throw error;
  }
};
