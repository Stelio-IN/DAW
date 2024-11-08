export default (sequelize, DataTypes) => {
    return sequelize.define('OrderItem', {
      order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      color_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
    }, { timestamps: false });
  };
  