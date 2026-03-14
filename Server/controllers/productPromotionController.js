import db from '../models/index.js';
const ProductPromotion = db.ProductPromotion;

/* ================= CREATE ================= */
const createAssociation = async (req, res) => {
  try {
    const {
      promotion_id,
      product_id,
      product_color_id,
      product_color_size_id,
    } = req.body;

    // regra importante: apenas UM nível deve ser preenchido
    const filled =
      [product_id, product_color_id, product_color_size_id].filter(v => v != null)
        .length;

    if (filled !== 1) {
      return res.status(400).json({
        error:
          'Informe apenas UM: product_id OU product_color_id OU product_color_size_id',
      });
    }

    const association = await ProductPromotion.create({
      promotion_id,
      product_id: product_id || null,
      product_color_id: product_color_id || null,
      product_color_size_id: product_color_size_id || null,
    });

    res.status(201).json(association);
  } catch (error) {
    console.error('Erro ao associar promoção:', error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET ALL ================= */
const getAllAssociations = async (req, res) => {
  try {
    const query = `
      SELECT
        pp.id,
        pp.promotion_id,

        pp.product_id,
        p.name AS product_name,

        pp.product_color_id,
        c.name AS color_name,

        pp.product_color_size_id,
        s.size AS size

      FROM product_promotions pp

      LEFT JOIN products p
        ON p.product_id = pp.product_id

      LEFT JOIN productcolors pc
        ON pc.product_color_id = pp.product_color_id

      LEFT JOIN colors c
        ON c.color_id = pc.color_id

      LEFT JOIN product_color_sizes pcs
        ON pcs.product_color_size_id = pp.product_color_size_id

      LEFT JOIN sizes s
        ON s.size_id = pcs.size_id

      ORDER BY pp.id DESC
    `;

    const associations = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(associations);
  } catch (error) {
    console.error('Error fetching associations:', error);
    res.status(500).json({ error: error.message });
  }
};


/* ================= GET BY ID ================= */
const getAssociationById = async (req, res) => {
  try {
    const association = await ProductPromotion.findByPk(req.params.id);
    if (!association) {
      return res.status(404).json({ message: 'Associação não encontrada' });
    }
    res.status(200).json(association);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE ================= */
const deleteAssociation = async (req, res) => {
  try {
    const deleted = await ProductPromotion.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Associação não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE BY PROMOTION ================= */
const deleteByPromotion = async (req, res) => {
  try {
    await ProductPromotion.destroy({
      where: { promotion_id: req.params.promotionId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createAssociation,
  getAllAssociations,
  getAssociationById,
  deleteAssociation,
  deleteByPromotion,
};
