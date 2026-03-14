import db from '../models/index.js';
const Promotion = db.Promotion;

/* ================= CREATE ================= */
const createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (error) {
    console.error('Erro ao criar promoção:', error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET ALL ================= */
const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      order: [['created_at', 'DESC']],
    });
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET BY ID ================= */
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findByPk(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promoção não encontrada' });
    }
    res.status(200).json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE ================= */
const updatePromotion = async (req, res) => {
  try {
    const [updated] = await Promotion.update(req.body, {
      where: { promotion_id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ message: 'Promoção não encontrada' });
    }

    const updatedPromotion = await Promotion.findByPk(req.params.id);
    res.status(200).json(updatedPromotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE ================= */
const deletePromotion = async (req, res) => {
  try {
    const deleted = await Promotion.destroy({
      where: { promotion_id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Promoção não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
};
