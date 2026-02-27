import express, { type Application } from "express";
import cors from "cors";
import apiRoutes from "./config/routes/index.js";

export const createApp = async (): Promise<Application> => {
    const app = express();

    // ── Middlewares globais ──────────────────────
    app.use(cors());
    app.use(express.json());

    // ── Rotas da API ─────────────────────────────
    app.use("/api", apiRoutes);

    return app;
};
