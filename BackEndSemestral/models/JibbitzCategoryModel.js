export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzCategory',
    {
      category_id: {
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

      status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
      },
    },
    {
      tableName: 'jibbitz_categories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
