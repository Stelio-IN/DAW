import db from '../models/index.js';
const ProductImage = db.ProductImage;

const createProductImage = async (req, res) => {
  try {
    const productImage = await ProductImage.create(req.body);
    res.status(201).json(productImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProductImages = async (req, res) => {
  try {
    const productImages = await ProductImage.findAll();
    res.status(200).json(productImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductImageById = async (req, res) => {
  try {
    const productImage = await ProductImage.findByPk(req.params.id);
    if (productImage) {
      res.status(200).json(productImage);
    } else {
      res.status(404).json({ message: 'ProductImage not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductImage = async (req, res) => {
  try {
    const [updated] = await ProductImage.update(req.body, {
      where: { image_id: req.params.id },
    });
    if (updated) {
      const updatedProductImage = await ProductImage.findByPk(req.params.id);
      res.status(200).json(updatedProductImage);
    } else {
      res.status(404).json({ message: 'ProductImage not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const deleted = await ProductImage.destroy({
      where: { image_id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: 'ProductImage deleted' });
    } else {
      res.status(404).json({ message: 'ProductImage not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
    createProductImage,
    getAllProductImages,
    getProductImageById,
    updateProductImage,
    deleteProductImage
}