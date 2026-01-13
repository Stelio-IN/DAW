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
        allowNull: false,  // agora obrigatório
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,  // obrigatório
      },
      product_color_size_id: {
        type: DataTypes.INTEGER,
        allowNull: false,  // obrigatório
      },
      color_id: {
        type: DataTypes.INTEGER,
        allowNull: false,  // obrigatório
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,  // obrigatório
      },
      unit_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,  // obrigatório
      },
      base_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,  // obrigatório
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
        defaultValue: 0.00, // valor padrão se não houver desconto
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
