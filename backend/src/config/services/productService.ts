import { pool } from '../database.js';

export const findAll = async () => {
  const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
  return result.rows;
};

export const findById = async (id: string) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const create = async (data: { name: string; description?: string; unit_price: number; unit: string }) => {
  const result = await pool.query(
    'INSERT INTO products (name, description, unit_price, unit) VALUES ($1, $2, $3, $4) RETURNING *',
    [data.name, data.description, data.unit_price, data.unit]
  );
  return result.rows[0];
};

export const update = async (id: string, data: { name: string; description?: string; unit_price: number; unit: string }) => {
  const result = await pool.query(
    'UPDATE products SET name = $1, description = $2, unit_price = $3, unit = $4 WHERE id = $5 RETURNING *',
    [data.name, data.description, data.unit_price, data.unit, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: string) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  return (result.rowCount ?? 0) > 0;
};
