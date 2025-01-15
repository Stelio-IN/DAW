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

const ProductHistory = async (req, res) => {
  try {
    // Consulta para buscar o histórico de compras
    const productHistory = await db.sequelize.query(`
SELECT 
  p.order_id, 
  p.payer_name, 
  p.created_at, 
  c.nome_produto, 
  c.quantidade, 
  c.preco_unitario, 
  c.preco_total, 
  MAX(pi.image_url) AS primary_image_url  -- Garantir que traga a imagem principal (única)
FROM paymentos p
INNER JOIN compras c ON c.pagamento_id = p.id
INNER JOIN products pr ON c.produto_id = pr.product_id  -- Junção com a tabela Products
LEFT JOIN productcolors pc ON pr.product_id = pc.product_id
LEFT JOIN productimages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
GROUP BY p.order_id, p.payer_name, p.created_at, c.nome_produto, c.quantidade, c.preco_unitario, c.preco_total
ORDER BY p.order_id;  -- Ordena pelos order_id
    `, {
      type: db.sequelize.QueryTypes.SELECT, // Tipo de consulta
    });

    if (productHistory.length === 0) {
      return res.status(404).json({ error: 'Nenhum histórico de compras encontrado.' });
    }

    // Retorna o histórico de compras
    res.status(200).json(productHistory);
  } catch (error) {
    console.error('Erro ao buscar histórico de compras:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller para obter produtos por categoria
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    // Verifique se o categoryId foi passado corretamente
    if (!categoryId) {
      return res.status(400).json({ message: "Categoria não fornecida." });
    }

    // Ajuste na consulta para usar o Sequelize com o método replacements
    const products = await db.sequelize.query(
      `
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
      WHERE p.category_id = :categoryId
      GROUP BY p.product_id
    `, // Usando :categoryId como parâmetro nomeado
      {
        replacements: { categoryId }, // Substituindo :categoryId com o valor real
        type: db.sequelize.QueryTypes.SELECT // Definindo o tipo de consulta como SELECT
      }
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado para esta categoria." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
  }
};

// Controller para obter produtos por categoria
const getProductsByColor = async (req, res) => {
  const { colorId } = req.params;
  
  try {
    // Verifique se o categoryId foi passado corretamente
    if (!colorId) {
      return res.status(400).json({ message: "Cor não fornecida." });
    }

    // Ajuste na consulta para usar o Sequelize com o método replacements
    const products = await db.sequelize.query(
      `
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
      WHERE c.color_id = :colorId
      GROUP BY p.product_id
    `, // Usando :categoryId como parâmetro nomeado
      {
        replacements: { colorId }, // Substituindo :categoryId com o valor real
        type: db.sequelize.QueryTypes.SELECT // Definindo o tipo de consulta como SELECT
      }
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado para esta cor." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
  }
};


const getProductsByPrice = async (req, res) => {
  const { min, max } = req.params; // Use os nomes min e max para os parâmetros

  // Log para verificar os parâmetros recebidos
  console.log("Recebendo parâmetros:", { min, max });

  try {
    if (min == null || max == null) {
      console.warn("Intervalo de preço inválido recebido.");
      return res.status(400).json({ message: "Intervalo de preço inválido." });
    }

    // Log antes da consulta
    console.log(`Iniciando consulta para intervalo de preço: ${min} a ${max}`);

    const products = await db.sequelize.query(
      `
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
      WHERE p.price BETWEEN :min AND :max
      GROUP BY p.product_id
    `,
      {
        replacements: { min, max },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    // Log para verificar os resultados da consulta
    console.log("Produtos encontrados:", products);

    if (products.length === 0) {
      console.warn("Nenhum produto encontrado no intervalo fornecido.");
      return res.status(404).json({ message: "Nenhum produto encontrado neste intervalo de preço." });
    }

    // Log para indicar que a resposta foi enviada com sucesso
    console.log("Enviando resposta com produtos.");
    res.status(200).json(products);
  } catch (error) {
    // Log de erro detalhado
    console.error("Erro ao buscar produtos por preço:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
  }
};




// Controller para obter produtos por Genero
const getProductsByGender = async (req, res) => {
  const { genderId } = req.params;
  
  try {
    // Verifique se o genderId foi passado corretamente
    if (!genderId) {
      return res.status(400).json({ message: "Genero não fornecido." });
    }

    // Ajuste na consulta para usar o Sequelize com o método replacements
    const products = await db.sequelize.query(
      `
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
      WHERE p.gender_id = :genderId
      GROUP BY p.product_id
    `, // Usando :genderId como parâmetro nomeado
      {
        replacements: { genderId }, // Substituindo :categoryId com o valor real
        type: db.sequelize.QueryTypes.SELECT // Definindo o tipo de consulta como SELECT
      }
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado para este genero." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
  }
};

// Controller para obter produtos por tamanho
const getProductsBySize  = async (req, res) => {
  const { SizeId } = req.params;
  
  try {
    // Verifique se o genderId foi passado corretamente
    if (!SizeId) {
      return res.status(400).json({ message: "Genero não fornecido." });
    }

    // Ajuste na consulta para usar o Sequelize com o método replacements
    const products = await db.sequelize.query(
      `
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
      WHERE p.gender_id = :SizeId
      GROUP BY p.product_id
    `, // Usando :genderId como parâmetro nomeado
      {
        replacements: { SizeId }, // Substituindo :categoryId com o valor real
        type: db.sequelize.QueryTypes.SELECT // Definindo o tipo de consulta como SELECT
      }
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: "Nenhum produto encontrado para este genero." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
  }
};







export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    products,
    getProductsEspecific,
    ProductHistory,
    getProductsByCategory, 
    getProductsByColor, 
    getProductsByPrice,
    getProductsBySize, 
    getProductsByGender 
};