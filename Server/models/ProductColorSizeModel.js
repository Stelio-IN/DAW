export default (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductColorSize',
    {
      product_color_size_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_color_id: DataTypes.INTEGER,
      size_id: DataTypes.INTEGER,
      gender_id: DataTypes.INTEGER,
      stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      price_override: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      cost_price: {
  type: DataTypes.DECIMAL(10,2),
  allowNull: true,
  defaultValue: 0.00
},

      
    },
    {
      tableName: 'product_color_sizes', // 🔹 nome correto da tabela no DB
      timestamps: false,
      underscored: true, // opcional, se quiser mapear snake_case automaticamente
    }
  );
};
