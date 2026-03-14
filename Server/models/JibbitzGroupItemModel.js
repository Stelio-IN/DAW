export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzGroupItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      jibbitz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      variant_label: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'jibbitz_group_items',
      timestamps: false,
    }
  );
};
