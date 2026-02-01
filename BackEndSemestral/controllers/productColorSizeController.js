import db from '../models/index.js';
const ProductColorSize = db.ProductColorSize;

/* ==================== CREATE ==================== */
const createProductColorSize = async (req, res) => {
  try {
    const {
      product_color_id,
      size_id,
      gender_id,
      stock_quantity,
      sku,
      price_override,
      cost_price
    } = req.body;

    // Validação simples
    if (!product_color_id || !size_id || !gender_id || stock_quantity == null) {
      return res.status(400).json({ error: 'Campos obrigatórios: product_color_id, size_id, gender_id, stock_quantity' });
    }

    const newPCS = await ProductColorSize.create({
      product_color_id,
      size_id,
      gender_id,
      stock_quantity,
      sku,
      price_override,
      cost_price
    });

    res.status(201).json(newPCS);
  } catch (error) {
    console.error('[ERROR] Criar ProductColorSize:', error);
    res.status(500).json({ error: error.message });
  }
};

/* ==================== GET ALL ==================== */
const getAllProductColorSizes = async (req, res) => {
  try {
    const pcsList = await ProductColorSize.findAll();
    res.status(200).json(pcsList);
  } catch (error) {
    console.error('[ERROR] Listar ProductColorSizes:', error);
    res.status(500).json({ error: error.message });
  }
};

/* ==================== GET BY ID ==================== */
const getById = async (req, res) => {
  try {
    const pcs = await ProductColorSize.findByPk(req.params.id);
    if (pcs) {
      res.status(200).json(pcs);
    } else {
      res.status(404).json({ message: 'ProductColorSize não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ==================== GET BY PRODUCT_COLOR_ID ==================== */
const getByProductColorId = async (req, res) => {
  try {
    const { product_color_id } = req.params;

    const pcsList = await ProductColorSize.findAll({
      where: { product_color_id }
    });

    res.status(200).json(pcsList);
  } catch (error) {
    console.error('[ERROR] Buscar por product_color_id:', error);
    res.status(500).json({ error: error.message });
  }
};

/* ==================== UPDATE ==================== */
const updateProductColorSize = async (req, res) => {
  try {
    const [updated] = await ProductColorSize.update(req.body, {
      where: { product_color_size_id: req.params.id },
    });

    if (updated) {
      const updatedPCS = await ProductColorSize.findByPk(req.params.id);
      res.status(200).json(updatedPCS);
    } else {
      res.status(404).json({ message: 'ProductColorSize não encontrado' });
    }
  } catch (error) {
    console.error('[ERROR] Atualizar ProductColorSize:', error);
    res.status(500).json({ error: error.message });
  }
};

/* ==================== DELETE ==================== */
const deleteProductColorSize = async (req, res) => {
  try {
    const deleted = await ProductColorSize.destroy({
      where: { product_color_size_id: req.params.id },
    });

    if (deleted) {
      res.status(204).json({ message: 'ProductColorSize deletado' });
    } else {
      res.status(404).json({ message: 'ProductColorSize não encontrado' });
    }
  } catch (error) {
    console.error('[ERROR] Deletar ProductColorSize:', error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  createProductColorSize,
  getAllProductColorSizes,
  getById,
  getByProductColorId,
  updateProductColorSize,
  deleteProductColorSize
};
