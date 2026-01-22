import db from "../models/index.js";
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
      res.status(404).json({ message: "Product not found" });
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
      res.status(404).json({ message: "Product not found" });
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
      res.status(204).json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const products = async (req, res) => {
  try {
    const { search } = req.query; // Termo de pesquisa

    let query = `
      SELECT 
        p.product_id, 
        p.name AS product_name,
        p.price,
        p.description,
        p.status,
        g.name AS category_name,
        (
          SELECT COUNT(DISTINCT pc.color_id)
          FROM productcolors pc
          WHERE pc.product_id = p.product_id
        ) AS color_count,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', c.name,
            'hex_code', c.hex_code
          )
        ) AS colors,
        MAX(pi.image_url) AS primary_image_url
      FROM products p
      INNER JOIN categories g ON g.category_id = p.category_id
      LEFT JOIN productcolors pc ON p.product_id = pc.product_id
      LEFT JOIN colors c ON pc.color_id = c.color_id
      LEFT JOIN productimages pi 
        ON (pc.product_color_id = pi.product_color_id AND pi.is_primary = 1)
    `;

    // Filtro de busca, se existir
    if (search) {
      query += ` WHERE p.name LIKE :search OR p.description LIKE :search `;
    }

    query += ` GROUP BY p.product_id, p.name, p.price, p.description, p.status, g.name `;

    const products = await db.sequelize.query(query, {
      replacements: { search: `%${search || ""}%` },
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products with search:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProductsEspecific = async (req, res) => {
  const id = req.params.id;

  try {
    const [produto] = await db.sequelize.query(
      `
      SELECT 
        p.product_id,
        p.name AS product_name,
        p.price AS base_price,
        g.name AS category_name,
        p.description,
        p.status,
        MAX(pi.image_url) AS primary_image_url,

        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'product_color_id', pc.product_color_id,
              'name', c.name,
              'hex_code', c.hex_code,
              'stock_quantity', pc.stock_quantity,

              'images', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'image_id', pi2.image_id,
                    'image_url', pi2.image_url,
                    'is_primary', pi2.is_primary
                  )
                )
                FROM productimages pi2
                WHERE pi2.product_color_id = pc.product_color_id
              ),

              'sizes', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'product_color_size_id', pcs.product_color_size_id,
                    'sku', pcs.sku,
                    'size_id', pcs.size_id,
                    'size', s.size,
                    'size_type', st.name,
                    'stock_quantity', pcs.stock_quantity,

                    'base_price', COALESCE(pcs.price_override, p.price),
                    'cost_price', pcs.cost_price,

                    -- Aqui pegamos os valores da tabela promotions com COALESCE
                    'promo_stock_used', COALESCE(
                      (SELECT pr.promo_stock_used
                       FROM product_promotions pp
                       JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                       WHERE (pp.product_color_size_id = pcs.product_color_size_id
                              OR pp.product_color_id = pcs.product_color_id
                              OR pp.product_id = p.product_id)
                         AND NOW() BETWEEN pr.start_date AND pr.end_date
                       ORDER BY
                         CASE 
                           WHEN pp.product_color_size_id IS NOT NULL THEN 1
                           WHEN pp.product_color_id IS NOT NULL THEN 2
                           WHEN pp.product_id IS NOT NULL THEN 3
                         END
                       LIMIT 1), 0
                    ),

                    'promo_stock_limit', COALESCE(
                      (SELECT pr.promo_stock_limit
                       FROM product_promotions pp
                       JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                       WHERE (pp.product_color_size_id = pcs.product_color_size_id
                              OR pp.product_color_id = pcs.product_color_id
                              OR pp.product_id = p.product_id)
                         AND NOW() BETWEEN pr.start_date AND pr.end_date
                       ORDER BY
                         CASE 
                           WHEN pp.product_color_size_id IS NOT NULL THEN 1
                           WHEN pp.product_color_id IS NOT NULL THEN 2
                           WHEN pp.product_id IS NOT NULL THEN 3
                         END
                       LIMIT 1), 999999
                    ),

                    'promo_price', (
                      SELECT ROUND(COALESCE(pcs.price_override, p.price) * (1 - pr.discount_percentage / 100), 2)
                      FROM product_promotions pp
                      JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                      WHERE 
                        (pp.product_color_size_id = pcs.product_color_size_id
                          OR pp.product_color_id = pcs.product_color_id
                          OR pp.product_id = p.product_id)
                        AND NOW() BETWEEN pr.start_date AND pr.end_date
                      ORDER BY
                        CASE 
                          WHEN pp.product_color_size_id IS NOT NULL THEN 1
                          WHEN pp.product_color_id IS NOT NULL THEN 2
                          WHEN pp.product_id IS NOT NULL THEN 3
                        END
                      LIMIT 1
                    ),

                    'discount_percentage', (
                      SELECT pr.discount_percentage
                      FROM product_promotions pp
                      JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                      WHERE 
                        (pp.product_color_size_id = pcs.product_color_size_id
                          OR pp.product_color_id = pcs.product_color_id
                          OR pp.product_id = p.product_id)
                        AND NOW() BETWEEN pr.start_date AND pr.end_date
                      ORDER BY
                        CASE 
                          WHEN pp.product_color_size_id IS NOT NULL THEN 1
                          WHEN pp.product_color_id IS NOT NULL THEN 2
                          WHEN pp.product_id IS NOT NULL THEN 3
                        END
                      LIMIT 1
                    ),

                    'promotion_id', (
                      SELECT pr.promotion_id
                      FROM product_promotions pp
                      JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                      WHERE 
                        (pp.product_color_size_id = pcs.product_color_size_id
                          OR pp.product_color_id = pcs.product_color_id
                          OR pp.product_id = p.product_id)
                        AND NOW() BETWEEN pr.start_date AND pr.end_date
                      ORDER BY
                        CASE 
                          WHEN pp.product_color_size_id IS NOT NULL THEN 1
                          WHEN pp.product_color_id IS NOT NULL THEN 2
                          WHEN pp.product_id IS NOT NULL THEN 3
                        END
                      LIMIT 1
                    ),

                    'promotion_name', (
                      SELECT pr.name
                      FROM product_promotions pp
                      JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                      WHERE 
                        (pp.product_color_size_id = pcs.product_color_size_id
                          OR pp.product_color_id = pcs.product_color_id
                          OR pp.product_id = p.product_id)
                        AND NOW() BETWEEN pr.start_date AND pr.end_date
                      ORDER BY
                        CASE 
                          WHEN pp.product_color_size_id IS NOT NULL THEN 1
                          WHEN pp.product_color_id IS NOT NULL THEN 2
                          WHEN pp.product_id IS NOT NULL THEN 3
                        END
                      LIMIT 1
                    ),

                    'promotion_description', (
                      SELECT pr.description
                      FROM product_promotions pp
                      JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                      WHERE 
                        (pp.product_color_size_id = pcs.product_color_size_id
                          OR pp.product_color_id = pcs.product_color_id
                          OR pp.product_id = p.product_id)
                        AND NOW() BETWEEN pr.start_date AND pr.end_date
                      ORDER BY
                        CASE 
                          WHEN pp.product_color_size_id IS NOT NULL THEN 1
                          WHEN pp.product_color_id IS NOT NULL THEN 2
                          WHEN pp.product_id IS NOT NULL THEN 3
                        END
                      LIMIT 1
                    ),

                    'is_on_promotion', (
                      SELECT 1
                      FROM product_promotions pp
                      JOIN promotions pr ON pr.promotion_id = pp.promotion_id
                      WHERE 
                        (pp.product_color_size_id = pcs.product_color_size_id
                          OR pp.product_color_id = pcs.product_color_id
                          OR pp.product_id = p.product_id)
                        AND NOW() BETWEEN pr.start_date AND pr.end_date
                      ORDER BY
                        CASE 
                          WHEN pp.product_color_size_id IS NOT NULL THEN 1
                          WHEN pp.product_color_id IS NOT NULL THEN 2
                          WHEN pp.product_id IS NOT NULL THEN 3
                        END
                      LIMIT 1
                    )
                  )
                )
                FROM product_color_sizes pcs
                INNER JOIN sizes s ON pcs.size_id = s.size_id
                INNER JOIN size_types st ON s.size_type_id = st.size_type_id
                WHERE pcs.product_color_id = pc.product_color_id AND pcs.stock_quantity > 0

                ORDER BY
                  CASE 
                    WHEN s.size REGEXP '^[0-9]+$' THEN CAST(s.size AS UNSIGNED)
                    ELSE s.size
                  END ASC
              )
            )
          )
          FROM productcolors pc
          INNER JOIN colors c ON pc.color_id = c.color_id
          WHERE pc.product_id = p.product_id
          AND EXISTS (
            SELECT 1
            FROM product_color_sizes pcs
            WHERE pcs.product_color_id = pc.product_color_id
            AND pcs.stock_quantity > 0
          )
        ) AS colors

      FROM products p
      INNER JOIN categories g ON g.category_id = p.category_id
      LEFT JOIN productcolors pc ON p.product_id = pc.product_id
      LEFT JOIN productimages pi 
        ON pc.product_color_id = pi.product_color_id AND pi.is_primary = 1
      WHERE p.product_id = :id
      GROUP BY p.product_id, p.name, p.price, p.description, g.name, p.status
      `,
      {
        replacements: { id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({
      product_id: produto.product_id,
      name: produto.product_name,
      base_price: produto.base_price,
      description: produto.description,
      status: produto.status,
      category_name: produto.category_name,
      primary_image_url: produto.primary_image_url,
      colors: produto.colors || [],
    });
  } catch (error) {
    console.error("Erro ao buscar produto específico:", error);
    res.status(500).json({ error: error.message });
  }
};




const getProductByName = async (req, res) => {
  const { nome } = req.query;

  try {
    const [produto] = await db.sequelize.query(
      `
      SELECT 
        p.product_id, 
        p.name AS product_name, 
        p.price,
        g.name AS category_name, 
        p.description,
        p.stock_quantity AS estoque,
        MAX(pi.image_url) AS primary_image_url,
        (
  SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
      'product_color_id', pc.product_color_id,
      'name', c.name,
      'hex_code', c.hex_code,
      'stock_quantity', pc.stock_quantity,
      'images', (
        SELECT JSON_ARRAYAGG(pi.image_url)
        FROM ProductImages pi
        WHERE pi.product_color_id = pc.product_color_id
      )
    )
  )
  FROM ProductColors pc
  JOIN Colors c ON pc.color_id = c.color_id
  WHERE pc.product_id = p.product_id
) AS colors

      FROM Products p
      INNER JOIN categories g ON g.category_id = p.category_id
      LEFT JOIN ProductColors pc ON p.product_id = pc.product_id
      LEFT JOIN ProductImages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
      WHERE p.name LIKE :nome
      GROUP BY p.product_id
      LIMIT 1;
    `,
      {
        replacements: { nome: `%${nome}%` },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!produto)
      return res.status(404).json({ error: "Produto não encontrado" });

    res.json({
      product_id: produto.product_id,
      name: produto.product_name,
      price: produto.price,
      description: produto.description,
      category_name: produto.category_name,
      stock_quantity: produto.estoque,
      primary_image_url: produto.primary_image_url,
      colors: produto.colors,
    });
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({ error: err.message });
  }
};

const ProductHistory = async (req, res) => {
  try {
    // Consulta para buscar o histórico de compras
    const productHistory = await db.sequelize.query(
      `
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
    `,
      {
        type: db.sequelize.QueryTypes.SELECT, // Tipo de consulta
      }
    );
 
    if (productHistory.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum histórico de compras encontrado." });
    }

    // Retorna o histórico de compras
    res.status(200).json(productHistory);
  } catch (error) {
    console.error("Erro ao buscar histórico de compras:", error);
    res.status(500).json({ error: error.message });
  }
};

const UsuarioProductHistory = async (req, res) => {
  try {
    // Certifique-se de que o middleware autentica o usuário
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const userId = req.user.user_id; // pega o ID do usuário logado

    const productHistory = await db.sequelize.query(
      `
      SELECT 
        o.order_id,
        o.order_date,
        o.status,
        c.nome_produto,
        c.quantidade,
        c.preco_unitario,
        c.preco_total,
        MAX(pi.image_url) AS primary_image_url
      FROM orders o
      INNER JOIN compras c ON c.pagamento_id = o.order_id
      INNER JOIN products pr ON c.produto_id = pr.product_id
      LEFT JOIN productcolors pc ON pr.product_id = pc.product_id
      LEFT JOIN productimages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
      WHERE o.user_id = :userId
      GROUP BY o.order_id, o.order_date, o.status, c.nome_produto, c.quantidade, c.preco_unitario, c.preco_total
      ORDER BY o.order_id;
    `,
      {
        replacements: { userId },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (productHistory.length === 0) {
      return res.status(404).json({
        error: "Nenhum histórico de compras encontrado para este usuário.",
      });
    }

    res.status(200).json(productHistory);
  } catch (error) {
    console.error("Erro ao buscar histórico de compras:", error);
    res.status(500).json({ error: error.message });
  }
};

const ProductHistoryByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await db.sequelize.query(
      `
      SELECT 
        p.order_id, 
        p.payer_name, 
        p.created_at, 

        c.nome_produto, 
        c.quantidade, 
        c.preco_unitario, 
        c.preco_total,

        pr.product_id,
        pr.description,
        pr.price,
        pr.gender_id,

        g.name AS gender_name,

        pc.product_color_id,
        col.name AS color_name,
        col.hex_code,
        pc.stock_quantity,

        MAX(pi.image_url) AS primary_image_url
      
      FROM paymentos p
      INNER JOIN compras c ON c.pagamento_id = p.id
      INNER JOIN products pr ON c.produto_id = pr.product_id
      LEFT JOIN genders g ON pr.gender_id = g.gender_id
      LEFT JOIN productcolors pc ON pr.product_id = pc.product_id
      LEFT JOIN colors col ON pc.color_id = col.color_id
      LEFT JOIN productimages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
      
      WHERE p.order_id = :orderId

      GROUP BY 
        p.order_id, p.payer_name, p.created_at,
        c.nome_produto, c.quantidade, c.preco_unitario, c.preco_total,
        pr.product_id, pr.description, pr.price, pr.gender_id,
        g.name,
        pc.product_color_id, pc.stock_quantity,
        col.name, col.hex_code

      ORDER BY c.nome_produto
      `,
      {
        replacements: { orderId },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum produto encontrado para esse pedido." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar os produtos do pedido:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller para obter produtos por categoria
const getProductsByCategories = async (req, res) => {
  const { categoryIds } = req.params;

  console.log("Received categoryIds:", categoryIds);
  // Verifica se os IDs de categoria foram passados corretamente
  if (!categoryIds) {
    console.log("Error: No categoryIds provided.");
    return res.status(400).json({ message: "Estilos não fornecidos." });
  }

  const categoryIdsArray = categoryIds.split(","); // Transforma a string em um array
  console.log("Converted categoryIdsArray:", categoryIdsArray);
  try {
    // Ajuste na consulta para usar o Sequelize com múltiplos valores para category_id
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
      WHERE p.category_id IN (:categoryIds)
      GROUP BY p.product_id
    `,
      {
        replacements: { categoryIds: categoryIdsArray }, // Passa o array de IDs de categoria
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (products.length === 0) {
      console.log("No products found for the provided categories.");
      return res.status(404).json({
        message: "Nenhum produto encontrado para as categorias selecionadas.",
      });
    }

    console.log("Found products:", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: error.message });
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

    const colorArray = colorId.split(",");

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
      WHERE c.color_id IN (:colorId)
      GROUP BY p.product_id
    `, // Usando :categoryId como parâmetro nomeado
      {
        replacements: { colorId: colorArray }, // Substituindo :categoryId com o valor real
        type: db.sequelize.QueryTypes.SELECT, // Definindo o tipo de consulta como SELECT
      }
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado para esta cor." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: error.message });
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
      return res.status(404).json({
        message: "Nenhum produto encontrado neste intervalo de preço.",
      });
    }

    // Log para indicar que a resposta foi enviada com sucesso
    console.log("Enviando resposta com produtos.");
    res.status(200).json(products);
  } catch (error) {
    // Log de erro detalhado
    console.error("Erro ao buscar produtos por preço:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: error.message });
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

    const genderArray = genderId.split(",");
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
      WHERE p.gender_id IN (:genderId)
      GROUP BY p.product_id
    `, // Usando :genderId como parâmetro nomeado
      {
        replacements: { genderId: genderArray }, // Substituindo :categoryId com o valor real
        type: db.sequelize.QueryTypes.SELECT, // Definindo o tipo de consulta como SELECT
      }
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado para este genero." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: error.message });
  }
};

// Controller para obter produtos por tamanho
const getProductsBySize = async (req, res) => {
  const { sizeIds } = req.params;

  try {
    // Verifique se o genderId foi passado corretamente
    if (!sizeIds) {
      console.log("o tamanho = " + sizeIds);
      return res.status(400).json({ message: "tamanho não fornecido." });
    }

    const sizeArray = sizeIds.split(",");
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
   LEFT JOIN ProductSizes ps ON p.product_id = ps.product_id
WHERE ps.size_id IN (:sizeIds)
      GROUP BY p.product_id
    `, // Usando :genderId como parâmetro nomeado
      {
        replacements: { sizeIds: sizeArray }, // Substituindo :categoryId com o valor real
        type: db.sequelize.QueryTypes.SELECT, // Definindo o tipo de consulta como SELECT
      }
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum produto encontrado para este tamanho." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos", error: error.message });
  }
};

// Faturamento Mensal
const getFaturamentoMesAtual = async (req, res) => {
  try {
    const [faturamento] = await db.sequelize.query(
      `
      SELECT 
        SUM(c.preco_total) AS total_faturado
      FROM paymentos p
      JOIN compras c ON c.pagamento_id = p.id
      WHERE MONTH(p.created_at) = MONTH(CURRENT_DATE())
        AND YEAR(p.created_at) = YEAR(CURRENT_DATE());
    `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(faturamento || { total_faturado: 0 });
  } catch (error) {
    console.error("Erro ao calcular faturamento do mês atual:", error);
    res.status(500).json({ error: error.message });
  }
};

// Pedidos Mensal
const getTotalPedidosMensais = async (req, res) => {
  try {
    const pedidos = await db.sequelize.query(
      `
      SELECT COUNT(*) AS total_pedidos
      FROM paymentos
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(pedidos[0]);
  } catch (error) {
    console.error("Erro ao buscar total de pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar total de pedidos" });
  }
};

//Faturamento diario
const getFaturamentoPorDia = async (req, res) => {
  try {
    const resultados = await db.sequelize.query(
      `
      SELECT 
        DATE(p.created_at) AS data,
        SUM(c.preco_total) AS faturamento_diario
      FROM paymentos p
      INNER JOIN compras c ON c.pagamento_id = p.id
      WHERE MONTH(p.created_at) = MONTH(CURRENT_DATE())
        AND YEAR(p.created_at) = YEAR(CURRENT_DATE())
      GROUP BY DATE(p.created_at)
      ORDER BY DATE(p.created_at)
    `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(resultados);
  } catch (error) {
    console.error("Erro ao buscar faturamento diário:", error);
    res.status(500).json({ error: "Erro ao buscar faturamento diário" });
  }
};

// Vendas por Categoria (deve ser eliminada)
const getCategoriasMaisVendidas = async (req, res) => {
  try {
    const resultado = await db.sequelize.query(
      `
      SELECT 
        cat.name AS category,
        SUM(c.quantidade) AS total_vendido
      FROM compras c
      INNER JOIN products p ON c.produto_id = p.product_id
      INNER JOIN categories cat ON p.category_id = cat.category_id
      GROUP BY cat.name
      ORDER BY total_vendido DESC
    `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar categorias mais vendidas:", error);
    res.status(500).json({ error: "Erro interno ao buscar categorias." });
  }
};

// Categorias Vendidas por mes
const getCategoriasVendidasPorMes = async (req, res) => {
  try {
    const resultado = await db.sequelize.query(
      `
      SELECT 
        DATE_FORMAT(p.created_at, '%Y-%m') AS mes,
        cat.name AS categoria,
        SUM(c.quantidade) AS total_vendido
      FROM compras c
      INNER JOIN paymentos p ON c.pagamento_id = p.id
      INNER JOIN products pr ON c.produto_id = pr.product_id
      INNER JOIN categories cat ON pr.category_id = cat.category_id
      GROUP BY mes, categoria
      ORDER BY mes DESC, total_vendido DESC
    `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar vendas por categoria/mês:", error);
    res
      .status(500)
      .json({ error: "Erro ao gerar gráfico por categoria e mês." });
  }
};

// Produtos mais vendidos
const getProdutosMaisVendidosPorMes = async (req, res) => {
  const { mes } = req.query; // Formato: YYYY-MM

  try {
    const results = await db.sequelize.query(
      `
      SELECT 
        p.product_id,
        p.name AS nome_produto,
        SUM(c.quantidade) AS total_vendas,
        SUM(c.preco_total) AS total_faturado,
        MAX(pi.image_url) AS imagem_principal
      FROM compras c
      INNER JOIN paymentos pay ON c.pagamento_id = pay.id
      INNER JOIN products p ON c.produto_id = p.product_id
      LEFT JOIN productcolors pc ON p.product_id = pc.product_id
      LEFT JOIN productimages pi ON pc.product_color_id = pi.product_color_id AND pi.is_primary = true
      WHERE DATE_FORMAT(pay.created_at, '%Y-%m') = :mes
      GROUP BY p.product_id, p.name
      ORDER BY total_faturado DESC;
    `,
      {
        replacements: { mes }, // Ex: '2025-07'
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao buscar produtos mais vendidos:", error);
    res.status(500).json({ error: "Erro ao obter ranking de produtos." });
  }
};

// Faturamento + Pedido por hora
const getpedidosEReceitaPorHora = async (req, res) => {
  try {
    const { data } = req.query;

    const dataFiltro = data || new Date().toISOString().split("T")[0]; // ex: "2025-07-10"

    const resultados = await db.sequelize.query(
      `
      SELECT 
        HOUR(p.created_at) AS hora,
        COUNT(DISTINCT p.id) AS total_pedidos,
        SUM(c.preco_total) AS total_receita
      FROM paymentos p
      JOIN compras c ON c.pagamento_id = p.id
      WHERE DATE(p.created_at) = :dataFiltro
      GROUP BY hora
      ORDER BY hora ASC
    `,
      {
        replacements: { dataFiltro },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(resultados);
  } catch (error) {
    console.error("Erro ao buscar dados por hora:", error);
    res.status(500).json({ error: "Erro interno ao processar dados" });
  }
};

// Estoque total
const estoqueTotal = async (req, res) => {
  try {
    const [resultado] = await db.sequelize.query(`
      SELECT SUM(stock_quantity) AS total_estoque FROM ProductColors
    `);

    res.status(200).json({ totalEstoque: resultado[0].total_estoque });
  } catch (error) {
    console.error("Erro ao calcular estoque total:", error);
    res.status(500).json({ error: error.message });
  }
};
// Produtos Sem Estoque
const Semestoque = async (req, res) => {
  try {
    const [resultado] = await db.sequelize.query(`
      SELECT COUNT(*) AS sem_estoque FROM ProductColors where stock_quantity = 0
    `);

    res.status(200).json({ semEstoque: resultado[0].sem_estoque });
  } catch (error) {
    console.error("Erro ao calcular produtos sem estoque :", error);
    res.status(500).json({ error: error.message });
  }
};

// Produtos (cores) sem estoque
const ProdutosSemEstoqueDetalhado = async (req, res) => {
  try {
    const [resultado] = await db.sequelize.query(`
      SELECT 
        p.product_id,
        p.name AS product_name,
        p.price,
        pi.image_url AS primary_image_url,
        c.name AS color_name,
        pc.stock_quantity
      FROM ProductColors pc
      INNER JOIN Products p ON pc.product_id = p.product_id
      LEFT JOIN ProductImages pi ON pi.product_color_id = pc.product_color_id AND pi.is_primary = true
      LEFT JOIN Colors c ON pc.color_id = c.color_id
      WHERE pc.stock_quantity <= 10
      ORDER BY p.name
    `);

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar produtos sem estoque:", error);
    res.status(500).json({ error: error.message });
  }
};

// Estoque por produto cor
const ProdutosComEstoquePorCor = async (req, res) => {
  try {
    const resultado = await db.sequelize.query(
      `
      SELECT 
        p.product_id,
        p.name AS product_name,
        c.name AS color_name,
        pc.stock_quantity,
        MAX(pi.image_url) AS primary_image_url
      FROM ProductColors pc
      INNER JOIN Products p ON p.product_id = pc.product_id
      LEFT JOIN Colors c ON c.color_id = pc.color_id
      LEFT JOIN ProductImages pi ON pi.product_color_id = pc.product_color_id AND pi.is_primary = true
      GROUP BY p.product_id, pc.product_color_id, c.name, pc.stock_quantity
      ORDER BY p.product_id ASC, c.name ASC;
    `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar estoque por cor:", error);
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
  estoqueTotal,
  Semestoque,
  getProductsEspecific,
  ProductHistory,
  UsuarioProductHistory,
  getProductsByCategories,
  getProductsByColor,
  getProductsByPrice,
  getProductsBySize,
  getProductsByGender,
  ProductHistoryByOrderId,
  getFaturamentoMesAtual,
  getTotalPedidosMensais,
  getFaturamentoPorDia,
  getCategoriasMaisVendidas,
  getCategoriasVendidasPorMes,
  getProdutosMaisVendidosPorMes,
  getpedidosEReceitaPorHora,
  ProdutosSemEstoqueDetalhado,
  ProdutosComEstoquePorCor,
  getProductByName,
};
