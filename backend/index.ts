import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Adapter, Database, Resource } from '@adminjs/sql';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const run = async () => {
  AdminJS.registerAdapter({ Database, Resource });

  const adapter = new Adapter('postgresql', {
    connectionString: process.env.DATABASE_URL as string,
    database: 'crud_db',
  });

  const db = await adapter.init();

  const admin = new AdminJS({
    databases: [db],
    rootPath: '/admin',
    branding: {
      companyName: 'CrudApp Admin',
      withMadeWithLove: false,
    },
  });

  const app = express();
  app.use(cors());
  app.use(express.json());

  const adminRouter = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, adminRouter);

  // ── REST API ──────────────────────────────────

  app.get('/api/items', async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });

  app.post('/api/items', async (req: Request, res: Response) => {
    try {
      const { name } = req.body as { name: string };
      const result = await pool.query(
        'INSERT INTO items (name) VALUES ($1) RETURNING *',
        [name]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });

  app.delete('/api/items/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM items WHERE id = $1', [id]);
      res.json({ message: 'Item deleted' });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`AdminJS panel at http://localhost:${PORT}/admin`);
  });
};

run();
