export default (sequelize, DataTypes) => {
  return sequelize.define(
    "JibbitzOrderItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      jibbitz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 🔹 Preços base
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      total_base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },

      // 🔹 Preços finais / promoção
      promo_unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_promo_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      // 🔹 Promoção
      is_on_promotion: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      promotion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: null,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },

      // 🔹 Custos e lucros
      unit_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      profit_without_promo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      profit_with_promo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },

      // 🔹 Timestamps
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "jibbitz_order_items",
      timestamps: false, // usamos apenas created_at
    }
  );
};
