import { Sequelize, DataTypes } from 'sequelize';
import dbConfig from '../config/db.js';
import userModel from './UserModel.js';
import categoryModel from './CategoryModel.js';
import productModel from './ProductModel.js';
import colorModel from './ColorModel.js';
import productColorModel from './ProductColorModel.js';
import productImageModel from './ProductImageModel.js';
import orderModel from './OrderModel.js';
import orderItemModel from './OrderItemModel.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: console.log,
});

const db = {
  sequelize,
  Sequelize,
  User: userModel(sequelize, DataTypes),
  Category: categoryModel(sequelize, DataTypes),
  Product: productModel(sequelize, DataTypes),
  Color: colorModel(sequelize, DataTypes),
  ProductColor: productColorModel(sequelize, DataTypes),
  ProductImage: productImageModel(sequelize, DataTypes),
  Order: orderModel(sequelize, DataTypes),
  OrderItem: orderItemModel(sequelize, DataTypes),
};

// Associações
db.Category.hasMany(db.Product, { foreignKey: 'category_id' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

db.Product.belongsToMany(db.Color, { through: db.ProductColor, foreignKey: 'product_id' });
db.Color.belongsToMany(db.Product, { through: db.ProductColor, foreignKey: 'color_id' });

db.ProductColor.hasMany(db.ProductImage, { foreignKey: 'product_color_id' });
db.ProductImage.belongsTo(db.ProductColor, { foreignKey: 'product_color_id' });

db.User.hasMany(db.Order, { foreignKey: 'user_id' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Product.hasMany(db.OrderItem, { foreignKey: 'product_id' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'product_id' });

db.Color.hasMany(db.OrderItem, { foreignKey: 'color_id' });
db.OrderItem.belongsTo(db.Color, { foreignKey: 'color_id' });

// Função para autenticar e sincronizar com o banco de dados
(async () => {
// No arquivo onde você está configurando a conexão com o banco de dados
try {
  await sequelize.authenticate();
  console.log('Conexão bem-sucedida com o banco de dados.');

  // Sincroniza todas as tabelas, se não existirem
  await sequelize.sync({ force: false }); // Use 'force: true' para recriar as tabelas. Cuidado: isso exclui dados existentes.
  console.log('Tabelas sincronizadas com sucesso.');
} catch (error) {
  console.error('Erro ao conectar ao banco de dados:', error);
}

})();

export default db;
