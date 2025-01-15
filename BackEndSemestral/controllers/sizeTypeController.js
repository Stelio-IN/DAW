import db from "../models/index.js";
const SizeType = db.Size_Types;

const createSizeType = async (req, res) => {
  try {
    const sizeType = await SizeType.create(req.body);
    res.status(201).json(sizeType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSizeTypes = async (req, res) => {
  try {
    const sizeTypes = await SizeType.findAll();
    res.status(200).json(sizeTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createSizeType,
  getAllSizeTypes
};
