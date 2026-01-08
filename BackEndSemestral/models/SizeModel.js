export default (sequelize, DataTypes) => {
  const Size = sequelize.define(
    'Size',
    {
      size_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  Size.associate = (models) => {
    Size.belongsTo(models.Size_Types, { foreignKey: 'size_type_id' });
  };

  return Size;
};
