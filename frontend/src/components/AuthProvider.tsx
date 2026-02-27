import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token: string) => {
        try {
            const response = await fetch("/api/auth/verify", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                localStorage.removeItem("auth_token");
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            localStorage.removeItem("auth_token");
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await api.post<{ token: string; user: User }>(
            "/auth/login",
            { email, password },
        );

        localStorage.setItem("auth_token", response.token);
        setUser(response.user);
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        setUser(null);
        api.post("/auth/logout", {}).catch(() => {});
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
