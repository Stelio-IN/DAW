export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzPromotion',
    {
      promotion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      promo_stock_limit: {
        type: DataTypes.INTEGER,
      },

      promo_stock_used: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM('ativo', 'inativo', 'expirado'),
        defaultValue: 'ativo',
      },
    },
    {
      tableName: 'jibbitz_promotions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
