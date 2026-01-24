import db from "../models/index.js";
const jibbitz = db.Jibbitz;

const Jibbitzs = async (req, res) => {
  try {
    const query = `
      SELECT
        j.jibbitz_id,
        j.name,
        j.price AS base_price,
        j.description,
        j.status,
        c.name AS category_name,
        js.stock_quantity,

        MAX(ji.image_url) AS primary_image_url,

        -- Promoção ativa (direta ou por grupo)
        (
          SELECT jp.promotion_id
          FROM jibbitz_promotion_items jpi
          JOIN jibbitz_promotions jp 
            ON jp.promotion_id = jpi.promotion_id
          LEFT JOIN jibbitz_group_items jgi 
            ON jgi.group_id = jpi.group_id
          WHERE 
            (jpi.jibbitz_id = j.jibbitz_id OR jgi.jibbitz_id = j.jibbitz_id)
            AND NOW() BETWEEN jp.start_date AND jp.end_date
          LIMIT 1
        ) AS promotion_id,

        (
          SELECT jp.name
          FROM jibbitz_promotion_items jpi
          JOIN jibbitz_promotions jp 
            ON jp.promotion_id = jpi.promotion_id
          LEFT JOIN jibbitz_group_items jgi 
            ON jgi.group_id = jpi.group_id
          WHERE 
            (jpi.jibbitz_id = j.jibbitz_id OR jgi.jibbitz_id = j.jibbitz_id)
            AND NOW() BETWEEN jp.start_date AND jp.end_date
          LIMIT 1
        ) AS promotion_name,

        (
          SELECT jp.discount_percentage
          FROM jibbitz_promotion_items jpi
          JOIN jibbitz_promotions jp 
            ON jp.promotion_id = jpi.promotion_id
          LEFT JOIN jibbitz_group_items jgi 
            ON jgi.group_id = jpi.group_id
          WHERE 
            (jpi.jibbitz_id = j.jibbitz_id OR jgi.jibbitz_id = j.jibbitz_id)
            AND NOW() BETWEEN jp.start_date AND jp.end_date
          LIMIT 1
        ) AS discount_percentage,

        (
          SELECT ROUND(j.price * (1 - jp.discount_percentage / 100), 2)
          FROM jibbitz_promotion_items jpi
          JOIN jibbitz_promotions jp 
            ON jp.promotion_id = jpi.promotion_id
          LEFT JOIN jibbitz_group_items jgi 
            ON jgi.group_id = jpi.group_id
          WHERE 
            (jpi.jibbitz_id = j.jibbitz_id OR jgi.jibbitz_id = j.jibbitz_id)
            AND NOW() BETWEEN jp.start_date AND jp.end_date
          LIMIT 1
        ) AS promo_price,

        (
          SELECT 1
          FROM jibbitz_promotion_items jpi
          JOIN jibbitz_promotions jp 
            ON jp.promotion_id = jpi.promotion_id
          LEFT JOIN jibbitz_group_items jgi 
            ON jgi.group_id = jpi.group_id
          WHERE 
            (jpi.jibbitz_id = j.jibbitz_id OR jgi.jibbitz_id = j.jibbitz_id)
            AND NOW() BETWEEN jp.start_date AND jp.end_date
          LIMIT 1
        ) AS is_on_promotion

      FROM jibbitz j
      INNER JOIN jibbitz_categories c ON c.category_id = j.category_id
      LEFT JOIN jibbitz_stock js ON js.jibbitz_id = j.jibbitz_id
      LEFT JOIN jibbitz_images ji 
        ON ji.jibbitz_id = j.jibbitz_id AND ji.is_primary = 1

      WHERE j.status = 'ativo'
      GROUP BY j.jibbitz_id
      ORDER BY j.created_at DESC
    `;

    const jibbitz = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.json(jibbitz);
  } catch (error) {
    console.error("Erro ao buscar jibbitz:", error);
    res.status(500).json({ error: error.message });
  }
};

const getJibbitzDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const [jibbitz] = await db.sequelize.query(
      `
      SELECT
        j.jibbitz_id,
        j.name,
        j.description,
        j.price AS base_price,
        j.status,
        c.name AS category_name,
        js.stock_quantity,

        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'image_id', ji.image_id,
              'image_url', ji.image_url,
              'is_primary', ji.is_primary
            )
          )
          FROM jibbitz_images ji
          WHERE ji.jibbitz_id = j.jibbitz_id
        ) AS images,

        (
          SELECT jp.discount_percentage
          FROM jibbitz_promotion_items jpi
          JOIN jibbitz_promotions jp ON jp.promotion_id = jpi.promotion_id
          LEFT JOIN jibbitz_group_items jgi ON jgi.group_id = jpi.group_id
          WHERE 
            (jpi.jibbitz_id = j.jibbitz_id OR jgi.jibbitz_id = j.jibbitz_id)
            AND NOW() BETWEEN jp.start_date AND jp.end_date
          LIMIT 1
        ) AS discount_percentage,

        (
          SELECT ROUND(j.price * (1 - jp.discount_percentage / 100), 2)
          FROM jibbitz_promotion_items jpi
          JOIN jibbitz_promotions jp ON jp.promotion_id = jpi.promotion_id
          LEFT JOIN jibbitz_group_items jgi ON jgi.group_id = jpi.group_id
          WHERE 
            (jpi.jibbitz_id = j.jibbitz_id OR jgi.jibbitz_id = j.jibbitz_id)
            AND NOW() BETWEEN jp.start_date AND jp.end_date
          LIMIT 1
        ) AS promo_price

      FROM jibbitz j
      INNER JOIN jibbitz_categories c ON c.category_id = j.category_id
      LEFT JOIN jibbitz_stock js ON js.jibbitz_id = j.jibbitz_id
      WHERE j.jibbitz_id = :id
      `,
      {
        replacements: { id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!jibbitz) {
      return res.status(404).json({ error: "Jibbitz não encontrado" });
    }

    // 🔹 Outros jibbitz do mesmo grupo
    const related = await db.sequelize.query(
      `
      SELECT
        j2.jibbitz_id,
        j2.name,
        j2.price,
        MAX(ji.image_url) AS primary_image_url
      FROM jibbitz_group_items jgi
      INNER JOIN jibbitz_group_items jgi2 
        ON jgi.group_id = jgi2.group_id
      INNER JOIN jibbitz j2 
        ON j2.jibbitz_id = jgi2.jibbitz_id
      LEFT JOIN jibbitz_images ji 
        ON ji.jibbitz_id = j2.jibbitz_id AND ji.is_primary = 1
      WHERE jgi.jibbitz_id = :id
        AND j2.jibbitz_id <> :id
      GROUP BY j2.jibbitz_id
      `,
      {
        replacements: { id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      jibbitz,
      related_jibbitz: related,
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes do jibbitz:", error);
    res.status(500).json({ error: error.message });
  }
};


export default {
  Jibbitzs,
  getJibbitzDetails
};
