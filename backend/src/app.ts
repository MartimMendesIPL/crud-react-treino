import express, { type Application } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initAdminJS } from './config/adminjs.js';
import apiRoutes from './config/routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createApp = async (): Promise<Application> => {
  const app = express();
  // ── Middlewares globais ──────────────────────
  app.use(cors());
  app.use(express.json());
  app.use('/public', express.static(path.join(__dirname, '../public')));
  // ── Painel AdminJS ───────────────────────────
  const { admin, adminRouter } = await initAdminJS();
  app.use(admin.options.rootPath, adminRouter);
  // ── Rotas da API ─────────────────────────────
  app.use('/api', apiRoutes);

  return app;
};
