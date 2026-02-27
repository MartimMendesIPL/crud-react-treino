import type { Request, Response } from "express";
import * as orderService from "../services/orderService.js";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const orders = await orderService.findAll();
        res.json(orders);
    } catch (err) {
        console.error("getAll orders error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const order = await orderService.findById(id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(order);
    } catch (err) {
        console.error("getById order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            reference,
            proposal_id,
            client_id,
            section_id,
            status,
            due_date,
        } = req.body;
        if (!reference || !client_id) {
            res.status(400).json({
                error: "Fields reference and client_id are required",
            });
            return;
        }
        const order = await orderService.create({
            reference,
            proposal_id,
            client_id,
            section_id,
            status,
            due_date,
        });
        res.status(201).json(order);
    } catch (err) {
        console.error("create order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const {
            reference,
            proposal_id,
            client_id,
            section_id,
            status,
            due_date,
        } = req.body;
        if (!reference || !client_id || !status) {
            res.status(400).json({
                error: "Fields reference, client_id, and status are required",
            });
            return;
        }
        const order = await orderService.update(id, {
            reference,
            proposal_id,
            client_id,
            section_id,
            status,
            due_date,
        });
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(order);
    } catch (err) {
        console.error("update order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await orderService.remove(id);
        if (!deleted) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("delete order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ── Order Items ───────────────────────────────

export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.orderId as string;
        const items = await orderService.findItems(orderId);
        res.json(items);
    } catch (err) {
        console.error("getItems order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createItem = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const orderId = req.params.orderId as string;
        const { product_id, quantity, unit_price, notes } = req.body;
        if (!product_id || quantity == null || unit_price == null) {
            res.status(400).json({
                error: "Fields product_id, quantity, and unit_price are required",
            });
            return;
        }
        const item = await orderService.createItem(orderId, {
            product_id,
            quantity,
            unit_price,
            notes,
        });
        res.status(201).json(item);
    } catch (err) {
        console.error("createItem order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateItem = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { product_id, quantity, unit_price, notes } = req.body;
        if (!product_id || quantity == null || unit_price == null) {
            res.status(400).json({
                error: "Fields product_id, quantity, and unit_price are required",
            });
            return;
        }
        const item = await orderService.updateItem(id, {
            product_id,
            quantity,
            unit_price,
            notes,
        });
        if (!item) {
            res.status(404).json({ error: "Order item not found" });
            return;
        }
        res.json(item);
    } catch (err) {
        console.error("updateItem order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeItem = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await orderService.removeItem(id);
        if (!deleted) {
            res.status(404).json({ error: "Order item not found" });
            return;
        }
        res.json({ message: "Order item deleted successfully" });
    } catch (err) {
        console.error("removeItem order error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
