export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzGroup',
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      group_type: {
        type: DataTypes.ENUM('letters', 'numbers', 'icons', 'custom'),
        defaultValue: 'custom',
      },
    },
    {
      tableName: 'jibbitz_groups',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
