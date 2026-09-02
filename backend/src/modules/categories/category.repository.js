import { pool } from "../../config/database.js";

export async function findAllByUser(userId) {
  const result = await pool.query(
    `
      SELECT id, name, type
      FROM categories
      WHERE user_id = $1
      ORDER BY type DESC, name ASC
    `,
    [userId],
  );

  return result.rows;
}

export async function findByIdForUser(id, userId) {
  const result = await pool.query(
    `
      SELECT id, name, type
      FROM categories
      WHERE id = $1 AND user_id = $2
    `,
    [id, userId],
  );

  return result.rows[0] ?? null;
}

export async function findByNameForUser(name, userId) {
  const result = await pool.query(
    `
      SELECT id, name, type
      FROM categories
      WHERE lower(name) = lower($1) AND user_id = $2
    `,
    [name, userId],
  );

  return result.rows[0] ?? null;
}

export async function create({ userId, name, type }) {
  const result = await pool.query(
    `
      INSERT INTO categories (user_id, name, type)
      VALUES ($1, $2, $3)
      RETURNING id, name, type
    `,
    [userId, name, type],
  );

  return result.rows[0];
}
