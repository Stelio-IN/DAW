export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Jibbitz',
    {
      jibbitz_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM('ativo', 'esgotado', 'descontinuado'),
        defaultValue: 'ativo',
      },
    },
    {
      tableName: 'jibbitz',
      timestamps: true, 
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
