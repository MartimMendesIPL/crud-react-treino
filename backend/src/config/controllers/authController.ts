import type { Request, Response } from "express";
import * as authService from "../services/authService.js";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const result = await authService.login(email, password);

        if (!result) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        res.json(result);
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const user = await authService.verifyToken(token);

        if (!user) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        res.json({ user });
    } catch (err) {
        console.error("Verify token error:", err);
        res.status(401).json({ error: "Invalid token" });
    }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
    // For JWT, logout is handled client-side by removing the token
    // But we can still have this endpoint for consistency
    res.json({ message: "Logged out successfully" });
};
