export default (sequelize, DataTypes) => {
  const Size_Types = sequelize.define(
    "size_types",
    {
      size_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  Size_Types.associate = (models) => {
    Size_Types.hasMany(models.Size, { foreignKey: "size_type_id" });
  };

  return Size_Types;
};
