export default (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductColor',
    {
      product_color_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
     
    },
    { timestamps: false, tableName: 'productcolors' } // garante nome da tabela
  );
};
