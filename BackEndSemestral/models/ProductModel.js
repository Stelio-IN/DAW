export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Product',
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      category_id: DataTypes.INTEGER,
      gender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM('ativo', 'esgotado', 'lancamento', 'descontinuado'),
        defaultValue: 'ativo',
      },
    },
    { timestamps: true }
  );
};
