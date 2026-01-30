export default (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductColor',
    {
      product_color_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: DataTypes.INTEGER,
      color_id: DataTypes.INTEGER,
    },
    { timestamps: false }
  );
};
