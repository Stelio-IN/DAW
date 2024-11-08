export default (sequelize, DataTypes) => {
    return sequelize.define('Order', {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      order_date: DataTypes.DATE,
      status: DataTypes.STRING,
      total_amount: DataTypes.DECIMAL,

    }, { timestamps: true });
  };
  