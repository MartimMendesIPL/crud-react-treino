import { pool } from '../database.js';

export const findAll = async () => {
  const result = await pool.query(`
    SELECT o.*, c.name AS client_name, s.name AS section_name, p.reference AS proposal_reference
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN sections s ON o.section_id = s.id
    LEFT JOIN proposals p ON o.proposal_id = p.id
    ORDER BY o.id ASC
  `);
  return result.rows;
};

export const findById = async (id: string) => {
  const order = await pool.query(`
    SELECT o.*, c.name AS client_name, s.name AS section_name, p.reference AS proposal_reference
    FROM orders o
    LEFT JOIN clients c ON o.client_id = c.id
    LEFT JOIN sections s ON o.section_id = s.id
    LEFT JOIN proposals p ON o.proposal_id = p.id
    WHERE o.id = $1
  `, [id]);
  if (!order.rows[0]) return null;

  const items = await pool.query(`
    SELECT oi.*, pr.name AS product_name, pr.unit
    FROM order_items oi
    LEFT JOIN products pr ON oi.product_id = pr.id
    WHERE oi.order_id = $1
    ORDER BY oi.id ASC
  `, [id]);

  return { ...order.rows[0], items: items.rows };
};

export const create = async (data: { reference: string; proposal_id?: number; client_id: number; section_id?: number; status?: string; due_date?: string }) => {
  const result = await pool.query(
    'INSERT INTO orders (reference, proposal_id, client_id, section_id, status, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [data.reference, data.proposal_id, data.client_id, data.section_id, data.status ?? 'pending', data.due_date]
  );
  return result.rows[0];
};

export const update = async (id: string, data: { reference: string; proposal_id?: number; client_id: number; section_id?: number; status: string; due_date?: string }) => {
  const result = await pool.query(
    'UPDATE orders SET reference = $1, proposal_id = $2, client_id = $3, section_id = $4, status = $5, due_date = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
    [data.reference, data.proposal_id, data.client_id, data.section_id, data.status, data.due_date, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: string) => {
  const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
  return (result.rowCount ?? 0) > 0;
};

// ── Order Items ───────────────────────────────

export const findItems = async (orderId: string) => {
  const result = await pool.query(`
    SELECT oi.*, pr.name AS product_name, pr.unit
    FROM order_items oi
    LEFT JOIN products pr ON oi.product_id = pr.id
    WHERE oi.order_id = $1
    ORDER BY oi.id ASC
  `, [orderId]);
  return result.rows;
};

export const createItem = async (orderId: string, data: { product_id: number; quantity: number; unit_price: number; notes?: string }) => {
  const result = await pool.query(
    'INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [orderId, data.product_id, data.quantity, data.unit_price, data.notes]
  );
  return result.rows[0];
};

export const updateItem = async (itemId: string, data: { product_id: number; quantity: number; unit_price: number; notes?: string }) => {
  const result = await pool.query(
    'UPDATE order_items SET product_id = $1, quantity = $2, unit_price = $3, notes = $4 WHERE id = $5 RETURNING *',
    [data.product_id, data.quantity, data.unit_price, data.notes, itemId]
  );
  return result.rows[0] ?? null;
};

export const removeItem = async (itemId: string) => {
  const result = await pool.query('DELETE FROM order_items WHERE id = $1 RETURNING id', [itemId]);
  return (result.rowCount ?? 0) > 0;
};
