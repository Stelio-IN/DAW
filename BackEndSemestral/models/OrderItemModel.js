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
        allowNull: false,
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      product_color_size_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      color_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 🔹 Preço unitário SEM promoção
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      // 🔹 Preço unitário COM promoção
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      // 🔹 Desconto unitário (unit_price * discount_percentage)
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },

      // 🔹 Percentagem de desconto (ex: 0.3000 = 30%)
      discount_percentage: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: true,
        defaultValue: 0.0000,
      },

      // 🔹 Total sem promoção (unit_price * quantity)
      total_sem_promocao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      // 🔹 Total com promoção (base_price * quantity)
      total_com_promocao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      // 🔹 Total de desconto obtido
      total_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },

      // 🔹 Custo por unidade (vem de product_color_sizes.cost_price)
      custo_unidade: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },

      // 🔹 Custo total (custo_unidade * quantity)
      custo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },

      // 🔹 Lucro sem promoção
      lucro_sem_promocao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },

      // 🔹 Lucro com promoção
      lucro_com_promocao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
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
      tableName: 'orderitems',
      timestamps: false,
      underscored: true, // 🔥 MUITO IMPORTANTE para MySQL
    }
  );
};
