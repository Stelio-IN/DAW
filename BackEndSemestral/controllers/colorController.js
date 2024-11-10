import db from '../models/index.js';
const Color = db.Color;

const createColor = async (req, res) => {
  try {
    const color = await Color.create(req.body);
    res.status(201).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllColors = async (req, res) => {
  try {
    const colors = await Color.findAll();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getColorById = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (color) {
      res.status(200).json(color);
    } else {
      res.status(404).json({ message: 'Color not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateColor = async (req, res) => {
  try {
    const [updated] = await Color.update(req.body, {
      where: { color_id: req.params.id },
    });
    if (updated) {
      const updatedColor = await Color.findByPk(req.params.id);
      res.status(200).json(updatedColor);
    } else {
      res.status(404).json({ message: 'Color not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteColor = async (req, res) => {
  try {
    const deleted = await Color.destroy({
      where: { color_id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: 'Color deleted' });
    } else {
      res.status(404).json({ message: 'Color not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
    createColor,
    getAllColors,
    getColorById,
    updateColor,
    deleteColor    
};