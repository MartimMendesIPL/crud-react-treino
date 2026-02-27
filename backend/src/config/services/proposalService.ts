import { pool } from '../database.js';

export const findAll = async () => {
  const result = await pool.query(`
    SELECT p.*, c.name AS client_name, s.name AS section_name
    FROM proposals p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN sections s ON p.section_id = s.id
    ORDER BY p.id ASC
  `);
  return result.rows;
};

export const findById = async (id: string) => {
  const proposal = await pool.query(`
    SELECT p.*, c.name AS client_name, s.name AS section_name
    FROM proposals p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN sections s ON p.section_id = s.id
    WHERE p.id = $1
  `, [id]);
  if (!proposal.rows[0]) return null;

  const items = await pool.query(`
    SELECT pi.*, pr.name AS product_name, pr.unit
    FROM proposal_items pi
    LEFT JOIN products pr ON pi.product_id = pr.id
    WHERE pi.proposal_id = $1
    ORDER BY pi.id ASC
  `, [id]);

  return { ...proposal.rows[0], items: items.rows };
};

export const create = async (data: { reference: string; client_id: number; section_id?: number; status?: string; notes?: string }) => {
  const result = await pool.query(
    'INSERT INTO proposals (reference, client_id, section_id, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [data.reference, data.client_id, data.section_id, data.status ?? 'draft', data.notes]
  );
  return result.rows[0];
};

export const update = async (id: string, data: { reference: string; client_id: number; section_id?: number; status: string; notes?: string }) => {
  const result = await pool.query(
    'UPDATE proposals SET reference = $1, client_id = $2, section_id = $3, status = $4, notes = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
    [data.reference, data.client_id, data.section_id, data.status, data.notes, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: string) => {
  const result = await pool.query('DELETE FROM proposals WHERE id = $1 RETURNING id', [id]);
  return (result.rowCount ?? 0) > 0;
};

// ── Proposal Items ────────────────────────────

export const findItems = async (proposalId: string) => {
  const result = await pool.query(`
    SELECT pi.*, pr.name AS product_name, pr.unit
    FROM proposal_items pi
    LEFT JOIN products pr ON pi.product_id = pr.id
    WHERE pi.proposal_id = $1
    ORDER BY pi.id ASC
  `, [proposalId]);
  return result.rows;
};

export const createItem = async (proposalId: string, data: { product_id: number; quantity: number; unit_price: number; notes?: string }) => {
  const result = await pool.query(
    'INSERT INTO proposal_items (proposal_id, product_id, quantity, unit_price, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [proposalId, data.product_id, data.quantity, data.unit_price, data.notes]
  );
  return result.rows[0];
};

export const updateItem = async (itemId: string, data: { product_id: number; quantity: number; unit_price: number; notes?: string }) => {
  const result = await pool.query(
    'UPDATE proposal_items SET product_id = $1, quantity = $2, unit_price = $3, notes = $4 WHERE id = $5 RETURNING *',
    [data.product_id, data.quantity, data.unit_price, data.notes, itemId]
  );
  return result.rows[0] ?? null;
};

export const removeItem = async (itemId: string) => {
  const result = await pool.query('DELETE FROM proposal_items WHERE id = $1 RETURNING id', [itemId]);
  return (result.rowCount ?? 0) > 0;
};
