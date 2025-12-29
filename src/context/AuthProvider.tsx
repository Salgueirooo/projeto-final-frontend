import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    useEffect(() => {
        const onTokenChanged = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("tokenChanged", onTokenChanged);
        window.addEventListener("storage", onTokenChanged);

        return () => {
            window.removeEventListener("tokenChanged", onTokenChanged);
            window.removeEventListener("storage", onTokenChanged);
        };
    }, []);

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
