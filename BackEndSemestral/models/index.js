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
// Jibbitz Models
// =====================
import jibbitzCategoryModel from './JibbitzCategoryModel.js';
import jibbitzModel from './JibbitzModel.js';
import jibbitzStockModel from './JibbitzStockModel.js';
import jibbitzImageModel from './JibbitzImageModel.js';
import jibbitzGroupModel from './JibbitzGroupModel.js';
import jibbitzGroupItemModel from './JibbitzGroupItemModel.js';
import jibbitzOrderItemModel from './JibbitzOrderItemModel.js';
import jibbitzPromotionModel from './JibbitzPromotionModel.js';
import jibbitzPromotionItemModel from './JibbitzPromotionItemModel.js';
import jibbitzPromotionSaleModel from './JibbitzPromotionSaleModel.js';


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

    // =====================
  // Jibbitz Domain
  // =====================
  JibbitzCategory: jibbitzCategoryModel(sequelize, DataTypes),
  Jibbitz: jibbitzModel(sequelize, DataTypes),
  JibbitzStock: jibbitzStockModel(sequelize, DataTypes),
  JibbitzImage: jibbitzImageModel(sequelize, DataTypes),

  JibbitzGroup: jibbitzGroupModel(sequelize, DataTypes),
  JibbitzGroupItem: jibbitzGroupItemModel(sequelize, DataTypes),

  JibbitzOrderItem: jibbitzOrderItemModel(sequelize, DataTypes),

  JibbitzPromotion: jibbitzPromotionModel(sequelize, DataTypes),
  JibbitzPromotionItem: jibbitzPromotionItemModel(sequelize, DataTypes),
  JibbitzPromotionSale: jibbitzPromotionSaleModel(sequelize, DataTypes),

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

// =====================
// ProductPromotion (ajustado)
// =====================

// Promotion ↔ ProductPromotion (1:N)
db.Promotion.hasMany(db.ProductPromotion, {
  foreignKey: 'promotion_id',
  as: 'product_promotions', // útil para includes
});
db.ProductPromotion.belongsTo(db.Promotion, {
  foreignKey: 'promotion_id',
  as: 'promotion',
});

// Relacionamentos opcionais para Product / Color / ProductColorSize
db.Product.hasMany(db.ProductPromotion, { foreignKey: 'product_id' });
db.ProductPromotion.belongsTo(db.Product, { foreignKey: 'product_id' });

db.Color.hasMany(db.ProductPromotion, { foreignKey: 'product_color_id' });
db.ProductPromotion.belongsTo(db.Color, { foreignKey: 'product_color_id' });

db.ProductColorSize.hasMany(db.ProductPromotion, { foreignKey: 'product_color_size_id' });
db.ProductPromotion.belongsTo(db.ProductColorSize, { foreignKey: 'product_color_size_id' });

// =====================
// Promotion ↔ PromotionSale
// =====================
db.Promotion.hasMany(db.PromotionSale, { foreignKey: 'promotion_id' });
db.PromotionSale.belongsTo(db.Promotion, { foreignKey: 'promotion_id' });

// Order ↔ PromotionSale
db.Order.hasMany(db.PromotionSale, { foreignKey: 'order_id' });
db.PromotionSale.belongsTo(db.Order, { foreignKey: 'order_id' });

// ProductColorSize ↔ PromotionSale
db.ProductColorSize.hasMany(db.PromotionSale, { foreignKey: 'product_color_size_id' });
db.PromotionSale.belongsTo(db.ProductColorSize, { foreignKey: 'product_color_size_id' });


db.JibbitzCategory.hasMany(db.Jibbitz, { foreignKey: 'category_id' });
db.Jibbitz.belongsTo(db.JibbitzCategory, { foreignKey: 'category_id' });

db.Jibbitz.hasOne(db.JibbitzStock, { foreignKey: 'jibbitz_id' });
db.JibbitzStock.belongsTo(db.Jibbitz, { foreignKey: 'jibbitz_id' });

db.Jibbitz.hasMany(db.JibbitzImage, { foreignKey: 'jibbitz_id' });
db.JibbitzImage.belongsTo(db.Jibbitz, { foreignKey: 'jibbitz_id' });

db.Jibbitz.belongsToMany(db.JibbitzGroup, {
  through: db.JibbitzGroupItem,
  foreignKey: 'jibbitz_id',
});

db.JibbitzGroup.belongsToMany(db.Jibbitz, {
  through: db.JibbitzGroupItem,
  foreignKey: 'group_id',
});


db.JibbitzGroup.hasMany(db.JibbitzGroupItem, { foreignKey: 'group_id' });
db.JibbitzGroupItem.belongsTo(db.JibbitzGroup, { foreignKey: 'group_id' });

db.Jibbitz.hasMany(db.JibbitzGroupItem, { foreignKey: 'jibbitz_id' });
db.JibbitzGroupItem.belongsTo(db.Jibbitz, { foreignKey: 'jibbitz_id' });

db.Order.hasMany(db.JibbitzOrderItem, { foreignKey: 'order_id' });
db.JibbitzOrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Jibbitz.hasMany(db.JibbitzOrderItem, { foreignKey: 'jibbitz_id' });
db.JibbitzOrderItem.belongsTo(db.Jibbitz, { foreignKey: 'jibbitz_id' });


db.JibbitzPromotion.hasMany(db.JibbitzPromotionItem, {
  foreignKey: 'promotion_id',
});
db.JibbitzPromotionItem.belongsTo(db.JibbitzPromotion, {
  foreignKey: 'promotion_id',
});


db.Jibbitz.hasMany(db.JibbitzPromotionItem, { foreignKey: 'jibbitz_id' });
db.JibbitzPromotionItem.belongsTo(db.Jibbitz, { foreignKey: 'jibbitz_id' });

db.JibbitzGroup.hasMany(db.JibbitzPromotionItem, { foreignKey: 'group_id' });
db.JibbitzPromotionItem.belongsTo(db.JibbitzGroup, { foreignKey: 'group_id' });

db.JibbitzPromotion.hasMany(db.JibbitzPromotionSale, {
  foreignKey: 'promotion_id',
});
db.JibbitzPromotionSale.belongsTo(db.JibbitzPromotion, {
  foreignKey: 'promotion_id',
});


db.Order.hasMany(db.JibbitzPromotionSale, { foreignKey: 'order_id' });
db.JibbitzPromotionSale.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Jibbitz.hasMany(db.JibbitzPromotionSale, { foreignKey: 'jibbitz_id' });
db.JibbitzPromotionSale.belongsTo(db.Jibbitz, { foreignKey: 'jibbitz_id' });


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

        // =====================
    // Jibbitz
    // =====================
    await db.JibbitzCategory.sync();
    await db.Jibbitz.sync();
    await db.JibbitzStock.sync();
    await db.JibbitzImage.sync();

    await db.JibbitzGroup.sync();
    await db.JibbitzGroupItem.sync();

    await db.JibbitzPromotion.sync();
    await db.JibbitzPromotionItem.sync();
    await db.JibbitzPromotionSale.sync();

    await db.JibbitzOrderItem.sync();


    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
  }
})();

export default db;
