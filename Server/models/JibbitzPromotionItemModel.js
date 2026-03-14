export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzPromotionItem',
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

      jibbitz_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'jibbitz_promotion_items',
      timestamps: false,
    }
  );
};
