import { pool } from "../../config/database.js";

const movementSelect = `
  SELECT
    movement.id,
    movement.description,
    movement.amount,
    to_char(movement.date, 'YYYY-MM-DD') AS date,
    category.id AS category_id,
    category.name AS category_name,
    category.type AS category_type
  FROM movements AS movement
  INNER JOIN categories AS category
    ON category.id = movement.category_id
    AND category.user_id = movement.user_id
`;

export async function findAllByUser(userId) {
  const result = await pool.query(
    `
      ${movementSelect}
      WHERE movement.user_id = $1
      ORDER BY movement.date DESC, movement.id DESC
    `,
    [userId],
  );

  return result.rows;
}

export async function summarizeByUser(userId) {
  const result = await pool.query(
    `
      SELECT
        COALESCE(
          SUM(movement.amount) FILTER (WHERE category.type = 'income'),
          0
        ) AS total_income,
        COALESCE(
          SUM(movement.amount) FILTER (WHERE category.type = 'expense'),
          0
        ) AS total_expense
      FROM movements AS movement
      INNER JOIN categories AS category
        ON category.id = movement.category_id
        AND category.user_id = movement.user_id
      WHERE movement.user_id = $1
    `,
    [userId],
  );

  return result.rows[0];
}

export async function findByIdForUser(id, userId) {
  const result = await pool.query(
    `
      ${movementSelect}
      WHERE movement.id = $1 AND movement.user_id = $2
    `,
    [id, userId],
  );

  return result.rows[0] ?? null;
}

export async function create({ userId, description, amount, date, categoryId }) {
  const result = await pool.query(
    `
      INSERT INTO movements (user_id, description, amount, date, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    [userId, description, amount, date, categoryId],
  );

  return findByIdForUser(result.rows[0].id, userId);
}
