export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Promotion',
    {
      promotion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      discount_percentage: DataTypes.DECIMAL(5, 2),
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      promo_stock_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      promo_stock_used: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'promotions',
      timestamps: false, // já que está usando created_at/updated_at manualmente
    }
  );
};
