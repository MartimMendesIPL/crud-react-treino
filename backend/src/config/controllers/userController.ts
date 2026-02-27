import type { Request, Response } from 'express';
import * as userService from '../services/userService.js';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (err) {
    console.error('getAll users error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(user);
  } catch (err) {
    console.error('getById user error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password_hash, role } = req.body;
    if (!name || !email || !password_hash || !role) {
      res.status(400).json({ error: 'Fields name, email, password_hash, and role are required' });
      return;
    }
    const user = await userService.create({ name, email, password_hash, role });
    res.status(201).json(user);
  } catch (err) {
    console.error('create user error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      res.status(400).json({ error: 'Fields name, email, and role are required' });
      return;
    }
    const user = await userService.update(req.params.id, { name, email, role });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(user);
  } catch (err) {
    console.error('update user error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await userService.remove(req.params.id);
    if (!deleted) { res.status(404).json({ error: 'User not found' }); return; }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('delete user error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
