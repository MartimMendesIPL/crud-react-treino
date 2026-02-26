import express, { type Application } from 'express';
import cors from 'cors';
import { initAdminJS } from './config/adminjs.js';
import apiRoutes from './config/routes/index.js';

export const createApp = async (): Promise<Application> => {
  const app = express();

  // ── Middlewares globais ──────────────────────
  app.use(cors());
  app.use(express.json());

  // ── Painel AdminJS ───────────────────────────
  const { admin, adminRouter } = await initAdminJS();
  app.use(admin.options.rootPath, adminRouter);

  // ── Rotas da API ─────────────────────────────
  app.use('/api', apiRoutes);

  return app;
};
