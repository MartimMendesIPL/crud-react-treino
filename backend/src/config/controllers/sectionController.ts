import type { Request, Response } from 'express';
import * as sectionService from '../services/sectionService.js';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sections = await sectionService.findAll();
    res.json(sections);
  } catch (err) {
    console.error('getAll sections error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const section = await sectionService.findById(req.params.id);
    if (!section) { res.status(404).json({ error: 'Section not found' }); return; }
    res.json(section);
  } catch (err) {
    console.error('getById section error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    if (!name) { res.status(400).json({ error: 'Field "name" is required' }); return; }
    const section = await sectionService.create({ name, description });
    res.status(201).json(section);
  } catch (err) {
    console.error('create section error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    if (!name) { res.status(400).json({ error: 'Field "name" is required' }); return; }
    const section = await sectionService.update(req.params.id, { name, description });
    if (!section) { res.status(404).json({ error: 'Section not found' }); return; }
    res.json(section);
  } catch (err) {
    console.error('update section error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await sectionService.remove(req.params.id);
    if (!deleted) { res.status(404).json({ error: 'Section not found' }); return; }
    res.json({ message: 'Section deleted successfully' });
  } catch (err) {
    console.error('delete section error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
