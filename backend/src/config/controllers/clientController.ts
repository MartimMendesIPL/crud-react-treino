import type { Request, Response } from "express";
import * as clientService from "../services/clientService.js";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        const clients = await clientService.findAll();
        res.json(clients);
    } catch (err) {
        console.error("getAll clients error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const client = await clientService.findById(id);
        if (!client) {
            res.status(404).json({ error: "Client not found" });
            return;
        }
        res.json(client);
    } catch (err) {
        console.error("getById client error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, address, vat_number, notes } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Field "name" is required' });
            return;
        }
        const client = await clientService.create({
            name,
            email,
            phone,
            address,
            vat_number,
            notes,
        });
        res.status(201).json(client);
    } catch (err) {
        console.error("create client error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { name, email, phone, address, vat_number, notes } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Field "name" is required' });
            return;
        }
        const client = await clientService.update(id, {
            name,
            email,
            phone,
            address,
            vat_number,
            notes,
        });
        if (!client) {
            res.status(404).json({ error: "Client not found" });
            return;
        }
        res.json(client);
    } catch (err) {
        console.error("update client error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const deleted = await clientService.remove(id);
        if (!deleted) {
            res.status(404).json({ error: "Client not found" });
            return;
        }
        res.json({ message: "Client deleted successfully" });
    } catch (err) {
        console.error("delete client error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
