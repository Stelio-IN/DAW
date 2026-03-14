export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzStock',
    {
      stock_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      jibbitz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      sku: {
        type: DataTypes.STRING(100),
        unique: true,
      },

      cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
    },
    {
      tableName: 'jibbitz_stock',
      timestamps: false,
    }
  );
};
