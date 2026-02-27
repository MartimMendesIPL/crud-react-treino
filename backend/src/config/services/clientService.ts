import { pool } from '../database.js';

export const findAll = async () => {
  const result = await pool.query('SELECT * FROM clients ORDER BY id ASC');
  return result.rows;
};

export const findById = async (id: string) => {
  const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const create = async (data: { name: string; email?: string; phone?: string; address?: string; vat_number?: string; notes?: string }) => {
  const result = await pool.query(
    'INSERT INTO clients (name, email, phone, address, vat_number, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [data.name, data.email, data.phone, data.address, data.vat_number, data.notes]
  );
  return result.rows[0];
};

export const update = async (id: string, data: { name: string; email?: string; phone?: string; address?: string; vat_number?: string; notes?: string }) => {
  const result = await pool.query(
    'UPDATE clients SET name = $1, email = $2, phone = $3, address = $4, vat_number = $5, notes = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
    [data.name, data.email, data.phone, data.address, data.vat_number, data.notes, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: string) => {
  const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING id', [id]);
  return (result.rowCount ?? 0) > 0;
};
