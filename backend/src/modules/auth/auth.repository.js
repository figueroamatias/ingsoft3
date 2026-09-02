import { pool } from "../../config/database.js";

export async function findByEmail(email) {
  const result = await pool.query(
    `
      SELECT id, email, password_hash, created_at
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function findById(id) {
  const result = await pool.query(
    `
      SELECT id, email, created_at
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createWithCategories({ email, passwordHash, categories }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email, created_at
      `,
      [email, passwordHash],
    );
    const user = userResult.rows[0];

    for (const category of categories) {
      await client.query(
        `
          INSERT INTO categories (user_id, name, type)
          VALUES ($1, $2, $3)
        `,
        [user.id, category.name, category.type],
      );
    }

    await client.query("COMMIT");
    return user;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
