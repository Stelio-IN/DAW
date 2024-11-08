export default (sequelize, DataTypes) => {
    return sequelize.define('Color', {
      color_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      hex_code: DataTypes.STRING,
    }, { timestamps: false });
  };
  