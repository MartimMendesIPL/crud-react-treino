import { Router } from "express";
import userRoutes from "./userRoutes.js";
import clientRoutes from "./clientRoutes.js";
import sectionRoutes from "./sectionRoutes.js";
import productRoutes from "./productRoutes.js";
import proposalRoutes from "./proposalRoutes.js";
import orderRoutes from "./orderRoutes.js";
import auditRoutes from "./auditRoutes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/clients", clientRoutes);
router.use("/sections", sectionRoutes);
router.use("/products", productRoutes);
router.use("/proposals", proposalRoutes);
router.use("/orders", orderRoutes);
router.use("/audit-log", auditRoutes);

// Health check
router.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
