import { pool } from '../database.js';

export const findAll = async (limit = 50, offset = 0) => {
  const result = await pool.query(`
    SELECT a.*, u.name AS user_name
    FROM audit_log a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);
  return result.rows;
};

export const findByEntity = async (entityType: string, entityId: string) => {
  const result = await pool.query(`
    SELECT a.*, u.name AS user_name
    FROM audit_log a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.entity_type = $1 AND a.entity_id = $2
    ORDER BY a.created_at DESC
  `, [entityType, entityId]);
  return result.rows;
};

export const create = async (data: { user_id?: number; entity_type: string; entity_id: number; action: string; old_value?: object; new_value?: object }) => {
  const result = await pool.query(
    'INSERT INTO audit_log (user_id, entity_type, entity_id, action, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [data.user_id, data.entity_type, data.entity_id, data.action, JSON.stringify(data.old_value), JSON.stringify(data.new_value)]
  );
  return result.rows[0];
};
