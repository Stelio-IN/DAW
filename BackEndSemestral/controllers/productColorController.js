import db from '../models/index.js';
const ProductColor = db.ProductColor;

const createProductColor = async (req, res) => {
  try {
    const productColor = await ProductColor.create(req.body);
    res.status(201).json(productColor);
  } catch (error) {
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
    deleteProductColor
}