import cloudinary from '../config/cloudinary.js';
import db from '../models/index.js';
import fs from 'fs';

const ProductImage = db.ProductImage;

const uploadImage = async (req, res) => {
  const { product_color_id } = req.params;

  try {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: `products/colors/${product_color_id}`,
    });

    const image = await ProductImage.create({
      product_color_id,
      image_url: upload.secure_url,
      is_primary: false,
    });

    fs.unlinkSync(req.file.path); // Apaga o arquivo local temporário

    res.status(200).json({
      message: 'Imagem enviada com sucesso!',
      image,
    });
  } catch (err) {
    console.error('Erro ao fazer upload:', err);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
};





export default { uploadImage };
