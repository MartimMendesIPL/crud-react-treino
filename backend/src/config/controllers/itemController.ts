import type { Request, Response } from 'express';
import { pool } from '../database.js';

export const getAllItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('getAllItems error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body as { name: string };
    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'Field "name" is required' });
      return;
    }
    const result = await pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createItem error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('deleteItem error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
