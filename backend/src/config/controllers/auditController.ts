import type { Request, Response } from "express";
import * as auditService from "../services/auditService.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;
        const entries = await auditService.findAll(limit, offset);
        res.json(entries);
    } catch (err) {
        console.error("getAll audit error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getByEntity = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const entityType = req.params.entityType as string;
        const entityId = req.params.entityId as string;
        const entries = await auditService.findByEntity(entityType, entityId);
        res.json(entries);
    } catch (err) {
        console.error("getByEntity audit error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            user_id,
            entity_type,
            entity_id,
            action,
            old_value,
            new_value,
        } = req.body;
        if (!entity_type || !entity_id || !action) {
            res.status(400).json({
                error: "Fields entity_type, entity_id, and action are required",
            });
            return;
        }
        const entry = await auditService.create({
            user_id,
            entity_type,
            entity_id,
            action,
            old_value,
            new_value,
        });
        res.status(201).json(entry);
    } catch (err) {
        console.error("create audit error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
