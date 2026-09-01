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
  INNER JOIN categories AS category ON category.id = movement.category_id
`;

export async function findAll() {
  const result = await pool.query(`
    ${movementSelect}
    ORDER BY movement.date DESC, movement.id DESC
  `);

  return result.rows;
}

export async function summarizeByType() {
  const result = await pool.query(`
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
    INNER JOIN categories AS category ON category.id = movement.category_id
  `);

  return result.rows[0];
}

export async function findById(id) {
  const result = await pool.query(
    `
      ${movementSelect}
      WHERE movement.id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function create({ description, amount, date, categoryId }) {
  const result = await pool.query(
    `
      INSERT INTO movements (description, amount, date, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [description, amount, date, categoryId],
  );

  return findById(result.rows[0].id);
}
