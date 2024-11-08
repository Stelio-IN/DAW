export default (sequelize, DataTypes) => {
    return sequelize.define('Product', {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      stock_quantity: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    }, { timestamps: true });
  };
  