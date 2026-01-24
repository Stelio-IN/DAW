export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzPromotionSale',
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

      jibbitz_id: {
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
    },
    {
      tableName: 'jibbitz_promotion_sales',
      timestamps: true,
      createdAt: 'sold_at',
      updatedAt: false,
    }
  );
};
