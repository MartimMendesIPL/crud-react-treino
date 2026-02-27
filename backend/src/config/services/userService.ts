import { pool } from '../database.js';

export const findAll = async () => {
  const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC');
  return result.rows;
};

export const findById = async (id: string) => {
  const result = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const create = async (data: { name: string; email: string; password_hash: string; role: string }) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
    [data.name, data.email, data.password_hash, data.role]
  );
  return result.rows[0];
};

export const update = async (id: string, data: { name: string; email: string; role: string }) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role, created_at',
    [data.name, data.email, data.role, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: string) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return (result.rowCount ?? 0) > 0;
};
