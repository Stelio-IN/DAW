export default (sequelize, DataTypes) => {
  const PromotionSale = sequelize.define(
    "PromotionSale",
    {
      promotion_sale_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      promotion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      product_color_size_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      promo_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      sold_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      payment_method: {
        type: DataTypes.ENUM("mpesa", "paypal", "card", "emola"),
        allowNull: true,
      },

      customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      tableName: "promotion_sales",
      timestamps: false,
    }
  );

  return PromotionSale;
};
