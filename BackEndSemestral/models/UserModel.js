export default (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo_usuario: {
        type: DataTypes.STRING, // Alterado de ENUM para STRING
        allowNull: false,
        defaultValue: 'comum',
      },
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
    }
  );
};
