import db from '../models/index.js';
const ProductColor = db.ProductColor;

/* ==================== CREATE ==================== */
const createProductColor = async (req, res) => {
  try {
    console.log('[LOG] Recebendo dados para criar ProductColor:', req.body);

    // Garantir que os valores sejam números
    const product_id = Number(req.body.product_id);
    const color_id = Number(req.body.color_id);
  

    if (!product_id || !color_id) {
      console.warn('[WARN] Dados inválidos recebidos:', req.body);
      return res.status(400).json({ error: 'product_id, color_id devem ser números válidos' });
    }

    const newPC = await ProductColor.create({
      product_id,
      color_id     
    });

    console.log('[LOG] ProductColor criado com sucesso:', newPC.toJSON());
    res.status(201).json(newPC);

  } catch (error) {
    console.error('[ERROR] Erro ao criar ProductColor:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllProductColors = async (req, res) => {
  try {
    const productColors = await ProductColor.findAll();
    res.status(200).json(productColors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductColorById = async (req, res) => {
  try {
    const productColor = await ProductColor.findByPk(req.params.id);
    if (productColor) {
      res.status(200).json(productColor);
    } else {
      res.status(404).json({ message: 'ProductColor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ajustar conforme seu setup Sequelize

const getProductColorsByProductId = async (req, res) => {
  try {
    const { id } = req.params; // product_id

    // Query para buscar cores associadas ao produto
    const query = `
      SELECT 
        pc.product_color_id,
        pc.product_id,
        pc.color_id,
        c.name AS color_name,
        c.hex_code
      FROM productcolors pc
      INNER JOIN colors c ON c.color_id = pc.color_id
      WHERE pc.product_id = :product_id
    `;

    const colors = await db.sequelize.query(query, {
      replacements: { product_id: id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!colors || colors.length === 0) {
      return res.status(200).json([]); // retornar array vazio se não houver cores
    }

    // Retornar como array de objetos
    const result = colors.map((c) => ({
      product_color_id: c.product_color_id,
      product_id: c.product_id,
      color_id: c.color_id,
      Color: {
        name: c.color_name,
        hex_code: c.hex_code,
      },
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao buscar cores do produto:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET: todos os product colors
// GET: todos os product colors com verificação de stock real
// GET: todos os product colors com quantidade de stock real
const getAllProducts = async (req, res) => {
  try {
    // Query para buscar todos os productcolors com dados do produto e da cor
    // e somar o stock de todas as variações
    const query = `
      SELECT 
        p.product_id,
        p.name AS product_name,
        p.description,
        p.price,
        p.category_id,
        p.gender_id,
        p.status,
        pc.product_color_id,
        pc.color_id,
        c.name AS color_name,
        c.hex_code,
        -- soma de stock de todas as variações
        COALESCE(SUM(pcs.stock_quantity), 0) AS stock_quantity_total
      FROM productcolors pc
      INNER JOIN products p ON p.product_id = pc.product_id
      INNER JOIN colors c ON c.color_id = pc.color_id
      LEFT JOIN product_color_sizes pcs ON pcs.product_color_id = pc.product_color_id
      GROUP BY pc.product_color_id, p.product_id, c.color_id
      ORDER BY p.product_id, pc.product_color_id
    `;

    const rows = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    // Transformar em array organizado
    const result = rows.map((r) => ({
      product_color_id: r.product_color_id,
      product_id: r.product_id,
      product_name: r.product_name,
      description: r.description,
      price: r.price,
      category_id: r.category_id,
      gender_id: r.gender_id,
      status: r.status,
      stock_quantity_total: Number(r.stock_quantity_total), // quantidade total de stock
      Color: {
        color_id: r.color_id,
        name: r.color_name,
        hex_code: r.hex_code,
      },
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao buscar todos os product colors com stock real:', error);
    res.status(500).json({ error: error.message });
  }
};
 // traz info das tabelas products, productcolors, productimages, productcolorsize
const getAllProductInfo = async (req, res) => {
  try {
    /* ================== PRODUTOS + CORES + STOCK ================== */
    const productsQuery = `
      SELECT 
        p.product_id,
        p.name AS product_name,
        p.description,
        p.price,
        p.category_id,
        p.gender_id,
        p.status,
        pc.product_color_id,
        pc.color_id,
        c.name AS color_name,
        c.hex_code,
        COALESCE(SUM(pcs.stock_quantity), 0) AS stock_quantity_total
      FROM productcolors pc
      INNER JOIN products p ON p.product_id = pc.product_id
      INNER JOIN colors c ON c.color_id = pc.color_id
      LEFT JOIN product_color_sizes pcs 
        ON pcs.product_color_id = pc.product_color_id
      GROUP BY 
        pc.product_color_id,
        p.product_id,
        c.color_id
      ORDER BY p.product_id, pc.product_color_id
    `;

    const products = await db.sequelize.query(productsQuery, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    /* ================== IMAGENS ================== */
    const imagesQuery = `
      SELECT 
        image_id,
        product_color_id,
        image_url,
        is_primary
      FROM productimages
    `;

    const images = await db.sequelize.query(imagesQuery, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    /* ================== TAMANHOS ================== */
    const sizesQuery = `
      SELECT 
        pcs.product_color_size_id,
        pcs.product_color_id,
        pcs.size_id,
        pcs.gender_id,
        pcs.stock_quantity,
        pcs.sku,
        pcs.price_override,
        pcs.cost_price,
        s.size AS size
      FROM product_color_sizes pcs
      LEFT JOIN sizes s ON s.size_id = pcs.size_id
    `;

    const sizes = await db.sequelize.query(sizesQuery, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    /* ================== AGRUPAR IMAGENS E TAMANHOS POR product_color_id ================== */
    const imagesMap = {};
    images.forEach((img) => {
      if (!imagesMap[img.product_color_id]) imagesMap[img.product_color_id] = [];
      imagesMap[img.product_color_id].push({
        image_id: img.image_id,
        image_url: img.image_url,
        is_primary: !!img.is_primary,
      });
    });

    const sizesMap = {};
    sizes.forEach((sz) => {
      if (!sizesMap[sz.product_color_id]) sizesMap[sz.product_color_id] = [];
      sizesMap[sz.product_color_id].push({
        product_color_size_id: sz.product_color_size_id,
        size_id: sz.size_id,
        size: sz.size,
        gender_id: sz.gender_id,
        stock_quantity: sz.stock_quantity,
        sku: sz.sku,
        price_override: sz.price_override,
        cost_price: sz.cost_price,
      });
    });

    /* ================== MONTAR RESULTADO FINAL ================== */
    const result = products.map((p) => ({
      product_color_id: p.product_color_id,
      product_id: p.product_id,
      product_name: p.product_name,
      description: p.description,
      price: p.price,
      category_id: p.category_id,
      gender_id: p.gender_id,
      status: p.status,
      stock_quantity_total: Number(p.stock_quantity_total),
      Color: {
        color_id: p.color_id,
        name: p.color_name,
        hex_code: p.hex_code,
      },
      Images: imagesMap[p.product_color_id] || [],
      Sizes: sizesMap[p.product_color_id] || [], // 👈 Aqui entram os tamanhos
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error('Erro ao buscar produtos com stock, imagens e tamanhos:', error);
    res.status(500).json({ error: error.message });
  }
};






const updateProductColor = async (req, res) => {
  try {
    const [updated] = await ProductColor.update(req.body, {
      where: { product_color_id: req.params.id },
    });
    if (updated) {
      const updatedProductColor = await ProductColor.findByPk(req.params.id);
      res.status(200).json(updatedProductColor);
    } else {
      res.status(404).json({ message: 'ProductColor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductColor = async (req, res) => {
  try {
    const deleted = await ProductColor.destroy({
      where: { product_color_id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: 'ProductColor deleted' });
    } else {
      res.status(404).json({ message: 'ProductColor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default{
    createProductColor,
    getAllProductColors,
    getProductColorById,
    updateProductColor,
    deleteProductColor,
    getProductColorsByProductId,
    getAllProducts,
    getAllProductInfo
}