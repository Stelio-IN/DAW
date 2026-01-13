export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Order',
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      order_date: DataTypes.DATE,
      status: DataTypes.STRING,
      total_amount: DataTypes.DECIMAL(10,2),

      // Novos campos do frontend / base de dados
      customer_name: { type: DataTypes.STRING(150), allowNull: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: true },
      province: { type: DataTypes.STRING(100), allowNull: true },
      postal_code: { type: DataTypes.STRING(20), allowNull: true },
      country: { type: DataTypes.STRING(100), allowNull: true },

      subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: true },
      discount_amount: { type: DataTypes.DECIMAL(10,2), allowNull: true, defaultValue: 0.00 },
      shipping_amount: { type: DataTypes.DECIMAL(10,2), allowNull: true, defaultValue: 0.00 },

      payment_method: {
        type: DataTypes.ENUM('mpesa', 'paypal', 'card', 'emola'),
        allowNull: true
      },
      payment_status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED'),
        allowNull: true,
        defaultValue: 'PENDING'
      },
      mpesa_reference: { type: DataTypes.STRING(100), allowNull: true },
      payment_gateway_response: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: 'orders',
      timestamps: true,
    }
  );
};
