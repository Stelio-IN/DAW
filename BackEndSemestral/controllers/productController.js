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
    const { search } = req.query; // Termo de pesquisa enviado pelo cliente

    let query = `
      SELECT 
        p.product_id, 
        p.name AS product_name, 
        p.price, 
        (
          SELECT COUNT(DISTINCT pc_inner.color_id)
          FROM ProductColors pc_inner
          WHERE pc_inner.product_id = p.product_id
        ) AS color_count, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', c.name, 
            'hex_code', c.hex_code
          )
        ) AS colors,
        MAX(pi.image_url) AS primary_image_url
      FROM Products p
      LEFT JOIN ProductColors pc ON p.product_id = pc.product_id
      LEFT JOIN Colors c ON pc.color_id = c.color_id
      LEFT JOIN ProductImages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
    `;

    // Se houver um termo de pesquisa, adiciona o filtro
    if (search) {
      query += ` WHERE p.name LIKE :search OR p.description LIKE :search `;
    }

    query += ` GROUP BY p.product_id `;

    const products = await db.sequelize.query(query, {
      replacements: { search: `%${search}%` }, // Adiciona '%' para busca parcial
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products with search:', error);
    res.status(500).json({ error: error.message });
  }
};


const getProductsEspecific = async (req, res) => {
  const id = req.params.id;  // Acessando o parâmetro da URL
  
  try {
    // Consulta SQL adaptada para pegar um único produto com cores e imagens
    const product = await db.sequelize.query(`
      SELECT 
        p.product_id, 
        p.name AS product_name, 
        p.price, 
        p.description,
        pc.stock_quantity,
        MAX(pi.image_url) AS primary_image_url,  -- A imagem principal
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', c.name
          )
        ) AS colors  -- Agrupa as cores em um array
      FROM Products p
      LEFT JOIN ProductColors pc ON p.product_id = pc.product_id
      LEFT JOIN Colors c ON pc.color_id = c.color_id
      LEFT JOIN ProductImages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
      WHERE p.product_id = :id  -- Filtra pelo product_id recebido como parâmetro
      GROUP BY p.product_id  -- Agrupa pelo product_id para garantir um único resultado
    `, {
      replacements: { id },  // Passa o id dinamicamente
      type: db.sequelize.QueryTypes.SELECT,  // Tipo de consulta
    });

    if (product.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Organiza os dados para enviar de forma mais clara
    const productDetails = {
      product_id: product[0].product_id,
      name: product[0].product_name,
      price: product[0].price,
      description: product[0].description,
      stock_quantity: product[0].stock_quantity,
      primary_image_url: product[0].primary_image_url,
      colors: product[0].colors || [],  // Se a consulta já retornar um array, não é necessário JSON.parse
    };

    res.status(200).json(productDetails);  // Retorna o produto com as cores e imagem
  } catch (error) {
    console.error('Erro ao buscar produto específico:', error);
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