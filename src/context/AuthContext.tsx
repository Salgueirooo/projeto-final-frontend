import { createContext } from "react";

export type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);