import { pool } from "../../config/database.js";

export async function findAll() {
  const result = await pool.query(`
    SELECT id, name, type
    FROM categories
    ORDER BY type DESC, name ASC
  `);

  return result.rows;
}
