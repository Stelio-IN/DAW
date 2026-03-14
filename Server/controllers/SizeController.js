import db from "../models/index.js";
const Size = db.Size;

const createSize = async (req, res) => {
  try {
    const sizes = await Size.create(req.body);
    res.status(201).json(sizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSize = async (req, res) => {
  try {
    const sizes = await Size.findAll();
    res.status(200).json(sizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSizesByType = async (req, res) => {
  const { sizeTypeId } = req.params;
  try {
    const sizes = await Size.findAll({
      where: { size_type_id: sizeTypeId },
    });
    res.status(200).json(sizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createSize,
  getAllSize,
  getSizesByType
};
