export default (sequelize, DataTypes) => {
    return sequelize.define('ProductImage', {
      image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_color_id: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      is_primary: DataTypes.BOOLEAN,
    }, { timestamps: false });
  };
  