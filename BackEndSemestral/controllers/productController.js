import db from '../models/index.js';
const Product = db.Product;

 const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { product_id: req.params.id },
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { product_id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/*
const products = async (req, res) => {
  try {
    // Consulta para buscar produtos com cores e imagens associadas
    const products = await db.sequelize.query(`
      SELECT 
        p.product_id, 
        p.name AS product_name, 
        p.price, 
        COUNT(DISTINCT c.color_id) AS color_count, -- Conta as cores distintas
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', c.name, 
            'hex_code', c.hex_code
          )
        ) AS colors, -- Coleta as cores em formato JSON para agrupamento
        pi.image_id, 
        pi.image_url
      FROM Products p
      LEFT JOIN ProductColors pc ON p.product_id = pc.product_id
      LEFT JOIN Colors c ON pc.color_id = c.color_id
      LEFT JOIN ProductImages pi ON pc.product_color_id = pi.product_color_id
      WHERE pi.is_primary = true -- Filtra apenas imagens principais
      GROUP BY p.product_id, pi.image_id, pi.image_url
    `, {
      type: db.sequelize.QueryTypes.SELECT, // Especifica o tipo de consulta
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products with colors and images:', error);
    res.status(500).json({ error: error.message });
  }
};
*/
const products = async (req, res) => {
  try {
    // Consulta para buscar produtos com cores e imagens associadas, agrupando de forma adequada
    const products = await db.sequelize.query(`
      SELECT 
        p.product_id, 
        p.name AS product_name, 
        p.price, 
        (
          SELECT COUNT(DISTINCT pc_inner.color_id)
          FROM ProductColors pc_inner
          WHERE pc_inner.product_id = p.product_id
        ) AS color_count, -- Subconsulta para contar cores distintas associadas ao produto
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', c.name, 
            'hex_code', c.hex_code
          )
        ) AS colors, -- Coleta cores em formato JSON sem DISTINCT
        MAX(pi.image_url) AS primary_image_url -- Seleciona uma imagem principal por produto
      FROM Products p
      LEFT JOIN ProductColors pc ON p.product_id = pc.product_id
      LEFT JOIN Colors c ON pc.color_id = c.color_id
      LEFT JOIN ProductImages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
      GROUP BY p.product_id
    `, {
      type: db.sequelize.QueryTypes.SELECT, // Especifica o tipo de consulta
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products with colors and images:', error);
    res.status(500).json({ error: error.message });
  }
};


const getProductsEspecific = async (req, res) => {
  const id = req.params.id;  // Alteração: acessar o parâmetro da URL usando req.params.id
try {
  const products = await db.sequelize.query(`
    SELECT c.name, c.hex_code, p.price, p.description, pc.stock_quantity, pi.image_url
    FROM products p 
    JOIN productcolors pc ON p.product_id = pc.product_id 
    JOIN productimages pi ON pc.product_color_id = pi.product_color_id
    JOIN colors c on pc.color_id = c.color_id 
    WHERE p.product_id = :id and pi.is_primary = 1`, {
    replacements: { id },  // Passar o id dinamicamente
    type: db.sequelize.QueryTypes.SELECT, // Especifica o tipo de consulta
  });

  res.status(200).json(products);
} catch (error) {
  console.error('Error fetching products with colors and images:', error);
  res.status(500).json({ error: error.message });
}
};


export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    products,
    getProductsEspecific
};