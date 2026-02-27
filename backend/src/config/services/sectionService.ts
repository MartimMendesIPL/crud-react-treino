import { pool } from '../database.js';

export const findAll = async () => {
  const result = await pool.query('SELECT * FROM sections ORDER BY id ASC');
  return result.rows;
};

export const findById = async (id: string) => {
  const result = await pool.query('SELECT * FROM sections WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const create = async (data: { name: string; description?: string }) => {
  const result = await pool.query(
    'INSERT INTO sections (name, description) VALUES ($1, $2) RETURNING *',
    [data.name, data.description]
  );
  return result.rows[0];
};

export const update = async (id: string, data: { name: string; description?: string }) => {
  const result = await pool.query(
    'UPDATE sections SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [data.name, data.description, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: string) => {
  const result = await pool.query('DELETE FROM sections WHERE id = $1 RETURNING id', [id]);
  return (result.rowCount ?? 0) > 0;
};
