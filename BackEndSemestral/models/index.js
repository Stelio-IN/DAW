import { Sequelize, DataTypes } from 'sequelize';
import dbConfig from '../config/db.js';

// =====================
// Models
// =====================
import userModel from './UserModel.js';
import categoryModel from './CategoryModel.js';
import productModel from './ProductModel.js';
import colorModel from './ColorModel.js';
import productColorModel from './ProductColorModel.js';
import productColorSizeModel from './ProductColorSizeModel.js';
import productImageModel from './ProductImageModel.js';
import orderModel from './OrderModel.js';
import orderItemModel from './OrderItemModel.js';
import genderModel from './GenderModel.js';
import sizeTypeModel from './SizeTypeModel.js';
import sizeModel from './SizeModel.js';
import promotionModel from './PromotionsModel.js';
import productPromotionModel from './ProductPromotionsModel.js';
import promotionSaleModel from './PromotionSaleModel.js';

// =====================
// Sequelize instance
// =====================
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: console.log,
  }
);

// =====================
// Inicialização dos models
// =====================
const db = {
  sequelize,
  Sequelize,

  User: userModel(sequelize, DataTypes),
  Category: categoryModel(sequelize, DataTypes),
  Gender: genderModel(sequelize, DataTypes),

  Product: productModel(sequelize, DataTypes),
  Color: colorModel(sequelize, DataTypes),

  ProductColor: productColorModel(sequelize, DataTypes),
  ProductColorSize: productColorSizeModel(sequelize, DataTypes),
  ProductImage: productImageModel(sequelize, DataTypes),

  Size_Types: sizeTypeModel(sequelize, DataTypes),
  Size: sizeModel(sequelize, DataTypes),

  Promotion: promotionModel(sequelize, DataTypes),
  ProductPromotion: productPromotionModel(sequelize, DataTypes),

  Order: orderModel(sequelize, DataTypes),
  OrderItem: orderItemModel(sequelize, DataTypes),
  PromotionSale: promotionSaleModel(sequelize, DataTypes),
};

// =====================
// Associações
// =====================

// Category ↔ Product
db.Category.hasMany(db.Product, { foreignKey: 'category_id' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

// Gender ↔ Product
db.Gender.hasMany(db.Product, { foreignKey: 'gender_id' });
db.Product.belongsTo(db.Gender, { foreignKey: 'gender_id' });

// Product ↔ Color (N:N) via ProductColor
db.Product.belongsToMany(db.Color, {
  through: db.ProductColor,
  foreignKey: 'product_id',
});
db.Color.belongsToMany(db.Product, {
  through: db.ProductColor,
  foreignKey: 'color_id',
});

// ProductColor ↔ ProductImage
db.ProductColor.hasMany(db.ProductImage, { foreignKey: 'product_color_id' });
db.ProductImage.belongsTo(db.ProductColor, { foreignKey: 'product_color_id' });

// ProductColor ↔ ProductColorSize
db.ProductColor.hasMany(db.ProductColorSize, { foreignKey: 'product_color_id' });
db.ProductColorSize.belongsTo(db.ProductColor, { foreignKey: 'product_color_id' });

// ProductColor ↔ Product
db.ProductColor.belongsTo(db.Product, { foreignKey: 'product_id' });
db.Product.hasMany(db.ProductColor, { foreignKey: 'product_id' });

// Size ↔ ProductColorSize
db.Size.hasMany(db.ProductColorSize, { foreignKey: 'size_id' });
db.ProductColorSize.belongsTo(db.Size, { foreignKey: 'size_id' });

// Gender ↔ ProductColorSize
db.Gender.hasMany(db.ProductColorSize, { foreignKey: 'gender_id' });
db.ProductColorSize.belongsTo(db.Gender, { foreignKey: 'gender_id' });

// Size_Types ↔ Size
db.Size_Types.hasMany(db.Size, { foreignKey: 'size_type_id' });
db.Size.belongsTo(db.Size_Types, { foreignKey: 'size_type_id' });

// User ↔ Order
db.User.hasMany(db.Order, { foreignKey: 'user_id' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

// Order ↔ OrderItem
db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

// Product ↔ OrderItem
db.Product.hasMany(db.OrderItem, { foreignKey: 'product_id' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'product_id' });

// Color ↔ OrderItem
db.Color.hasMany(db.OrderItem, { foreignKey: 'color_id' });
db.OrderItem.belongsTo(db.Color, { foreignKey: 'color_id' });

// ProductColorSize ↔ OrderItem
db.ProductColorSize.hasMany(db.OrderItem, { foreignKey: 'product_color_size_id' });
db.OrderItem.belongsTo(db.ProductColorSize, { foreignKey: 'product_color_size_id' });

// ProductColorSize ↔ Promotion (N:N) via ProductPromotion
db.ProductColorSize.belongsToMany(db.Promotion, {
  through: db.ProductPromotion,
  foreignKey: 'product_color_size_id',
});
db.Promotion.belongsToMany(db.ProductColorSize, {
  through: db.ProductPromotion,
  foreignKey: 'promotion_id',
});

// Promotion ↔ PromotionSale
db.Promotion.hasMany(db.PromotionSale, { foreignKey: 'promotion_id' });
db.PromotionSale.belongsTo(db.Promotion, { foreignKey: 'promotion_id' });

// Order ↔ PromotionSale
db.Order.hasMany(db.PromotionSale, { foreignKey: 'order_id' });
db.PromotionSale.belongsTo(db.Order, { foreignKey: 'order_id' });

// ProductColorSize ↔ PromotionSale
db.ProductColorSize.hasMany(db.PromotionSale, { foreignKey: 'product_color_size_id' });
db.PromotionSale.belongsTo(db.ProductColorSize, { foreignKey: 'product_color_size_id' });

// =====================
// Conexão + Sync
// =====================
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');

    // Base
    await db.User.sync();
    await db.Category.sync();
    await db.Gender.sync();
    await db.Size_Types.sync();
    await db.Size.sync();
    await db.Color.sync();

    // Produtos
    await db.Product.sync();
    await db.ProductColor.sync();
    await db.ProductColorSize.sync();
    await db.ProductImage.sync();

    // Promoções
    await db.Promotion.sync();
    await db.ProductPromotion.sync();
    await db.PromotionSale.sync();

    // Pedidos
    await db.Order.sync();
    await db.OrderItem.sync();

    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
  }
})();

export default db;
