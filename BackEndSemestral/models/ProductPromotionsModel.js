export default (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductPromotion',
    {
      product_color_size_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'ProductColorSizes',
          key: 'product_color_size_id',
        },
      },
      promotion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'Promotions',
          key: 'promotion_id',
        },
      },
    },
    {
      tableName: 'product_promotions',
      timestamps: false,
    }
  );
};
