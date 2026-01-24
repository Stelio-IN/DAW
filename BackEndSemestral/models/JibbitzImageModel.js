export default (sequelize, DataTypes) => {
  return sequelize.define(
    'JibbitzImage',
    {
      image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      jibbitz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'jibbitz_images',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
};
