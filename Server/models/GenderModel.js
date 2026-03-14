export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Gender',
    {
      gender_id: {
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
};
