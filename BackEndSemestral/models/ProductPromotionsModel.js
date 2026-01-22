export default (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductPromotion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      promotion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      product_color_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      product_color_size_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'product_promotions',
      timestamps: false,
    }
  );
};
