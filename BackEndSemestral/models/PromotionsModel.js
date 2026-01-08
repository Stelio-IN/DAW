export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Promotion',
    {
      promotion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      discount_percentage: DataTypes.DECIMAL(5, 2),
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      tableName: 'promotions',
      timestamps: true,
    }
  );
};
