import type { Request, Response } from "express";
import * as productService from "../services/productService.js";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await productService.findAll();
        res.json(products);
    } catch (err) {
        console.error("getAll products error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const product = await productService.findById(id);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.json(product);
    } catch (err) {
        console.error("getById product error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, unit_price, unit } = req.body;
        if (!name || unit_price == null || !unit) {
            res.status(400).json({
                error: "Fields name, unit_price, and unit are required",
            });
            return;
        }
        const product = await productService.create({
            name,
            description,
            unit_price,
            unit,
        });
        res.status(201).json(product);
    } catch (err) {
        console.error("create product error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { name, description, unit_price, unit } = req.body;
        if (!name || unit_price == null || !unit) {
            res.status(400).json({
                error: "Fields name, unit_price, and unit are required",
            });
            return;
        }
        const product = await productService.update(id, {
            name,
            description,
            unit_price,
            unit,
        });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.json(product);
    } catch (err) {
        console.error("update product error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await productService.remove(id);
        if (!deleted) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("delete product error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
