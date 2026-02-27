import type { Request, Response } from "express";
import * as proposalService from "../services/proposalService.js";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const proposals = await proposalService.findAll();
        res.json(proposals);
    } catch (err) {
        console.error("getAll proposals error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const proposal = await proposalService.findById(id);
        if (!proposal) {
            res.status(404).json({ error: "Proposal not found" });
            return;
        }
        res.json(proposal);
    } catch (err) {
        console.error("getById proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reference, client_id, section_id, status, notes } = req.body;
        if (!reference || !client_id) {
            res.status(400).json({
                error: "Fields reference and client_id are required",
            });
            return;
        }
        const proposal = await proposalService.create({
            reference,
            client_id,
            section_id,
            status,
            notes,
        });
        res.status(201).json(proposal);
    } catch (err) {
        console.error("create proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { reference, client_id, section_id, status, notes } = req.body;
        if (!reference || !client_id || !status) {
            res.status(400).json({
                error: "Fields reference, client_id, and status are required",
            });
            return;
        }
        const proposal = await proposalService.update(id, {
            reference,
            client_id,
            section_id,
            status,
            notes,
        });
        if (!proposal) {
            res.status(404).json({ error: "Proposal not found" });
            return;
        }
        res.json(proposal);
    } catch (err) {
        console.error("update proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await proposalService.remove(id);
        if (!deleted) {
            res.status(404).json({ error: "Proposal not found" });
            return;
        }
        res.json({ message: "Proposal deleted successfully" });
    } catch (err) {
        console.error("delete proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ── Proposal Items ────────────────────────────

export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const proposalId = req.params.proposalId as string;
        const items = await proposalService.findItems(proposalId);
        res.json(items);
    } catch (err) {
        console.error("getItems proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createItem = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const proposalId = req.params.proposalId as string;
        const { product_id, quantity, unit_price, notes } = req.body;
        if (!product_id || quantity == null || unit_price == null) {
            res.status(400).json({
                error: "Fields product_id, quantity, and unit_price are required",
            });
            return;
        }
        const item = await proposalService.createItem(proposalId, {
            product_id,
            quantity,
            unit_price,
            notes,
        });
        res.status(201).json(item);
    } catch (err) {
        console.error("createItem proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateItem = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { product_id, quantity, unit_price, notes } = req.body;
        if (!product_id || quantity == null || unit_price == null) {
            res.status(400).json({
                error: "Fields product_id, quantity, and unit_price are required",
            });
            return;
        }
        const item = await proposalService.updateItem(req.params.id, {
            product_id,
            quantity,
            unit_price,
            notes,
        });
        if (!item) {
            res.status(404).json({ error: "Proposal item not found" });
            return;
        }
        res.json(item);
    } catch (err) {
        console.error("updateItem proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeItem = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const deleted = await proposalService.removeItem(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: "Proposal item not found" });
            return;
        }
        res.json({ message: "Proposal item deleted successfully" });
    } catch (err) {
        console.error("removeItem proposal error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
