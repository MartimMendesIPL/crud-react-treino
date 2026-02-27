import { pool } from "../database.js";
import crypto from "crypto";

// Simple JWT-like token generation (for production, use jsonwebtoken package)
const SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Simple password hashing (for production, use bcrypt)
function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

// Simple token generation (for production, use jsonwebtoken)
function generateToken(user: User): string {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    const payloadStr = JSON.stringify(payload);
    const signature = crypto
        .createHmac("sha256", SECRET)
        .update(payloadStr)
        .digest("hex");
    return Buffer.from(payloadStr).toString("base64") + "." + signature;
}

// Simple token verification (for production, use jsonwebtoken)
function verifyTokenString(token: string): User | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 2) {
            return null;
        }

        const [payloadB64, signature] = parts;

        // TypeScript now knows these are strings, not string | undefined
        if (!payloadB64 || !signature) {
            return null;
        }

        const payloadStr = Buffer.from(payloadB64, "base64").toString();
        const expectedSignature = crypto
            .createHmac("sha256", SECRET)
            .update(payloadStr)
            .digest("hex");

        if (signature !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(payloadStr);

        if (payload.exp < Date.now()) {
            return null; // Token expired
        }

        return {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            name: "",
        };
    } catch {
        return null;
    }
}

export const login = async (email: string, password: string) => {
    const hashedPassword = hashPassword(password);

    const result = await pool.query(
        "SELECT id, name, email, role FROM users WHERE email = $1 AND password_hash = $2",
        [email, hashedPassword],
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0] as User;
    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

export const verifyToken = async (token: string) => {
    const userData = verifyTokenString(token);

    if (!userData) {
        return null;
    }

    // Verify user still exists in database
    const result = await pool.query(
        "SELECT id, name, email, role FROM users WHERE id = $1",
        [userData.id],
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};
