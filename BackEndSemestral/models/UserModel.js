// UserModel.js
export default (sequelize, DataTypes) => {
  return sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
   
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    tipo_usuario: {
      type: DataTypes.ENUM('comum', 'admin'),
      allowNull: false,
    },
  }, {
    tableName: 'User',
    timestamps: true, // Ative timestamps para gerenciar createdAt e updatedAt automaticamente
    underscored: true // Isso irá usar snake_case para os nomes das colunas
  });
};
