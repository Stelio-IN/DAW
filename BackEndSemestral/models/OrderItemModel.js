export default (sequelize, DataTypes) => {
  return sequelize.define(
    'OrderItem',
    {
      order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_color_size_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      color_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      base_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      promotion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      promotion_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
    },
    {
      tableName: 'orderitems', // nome da tabela real
      timestamps: false        // sem createdAt / updatedAt
    }
  );
};
