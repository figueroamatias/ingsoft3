import { pool } from "../../config/database.js";

export async function findAll() {
  const result = await pool.query(`
    SELECT id, name, type
    FROM categories
    ORDER BY type DESC, name ASC
  `);

  return result.rows;
}

export async function findById(id) {
  const result = await pool.query(
    `
      SELECT id, name, type
      FROM categories
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function findByName(name) {
  const result = await pool.query(
    `
      SELECT id, name, type
      FROM categories
      WHERE lower(name) = lower($1)
    `,
    [name],
  );

  return result.rows[0] ?? null;
}

export async function create({ name, type }) {
  const result = await pool.query(
    `
      INSERT INTO categories (name, type)
      VALUES ($1, $2)
      RETURNING id, name, type
    `,
    [name, type],
  );

  return result.rows[0];
}
