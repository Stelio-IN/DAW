export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzOrderItem',
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

      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'jibbitz_order_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
};
