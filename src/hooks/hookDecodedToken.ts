import { useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  roles?: string[];
  exp: number;
}

const useDecodedToken = () => {
    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode<DecodedToken>(storedToken);
                setDecodedToken(decoded);
            } catch (err) {
                console.error("Token inválido: ", err);
            }
        } else {
            console.error("Token não encontrado.");
        }
    }, []);

    const hasRole = (role: string) => decodedToken?.roles?.includes(role) ?? false;

    const isAdmin = useMemo(() => hasRole("ROLE_ADMIN"), [decodedToken]);
    const isCounterEmployee = useMemo(
        () => hasRole("ROLE_COUNTER_EMPLOYEE"),
        [decodedToken]
    );
    const isConfectioner = useMemo(
        () => hasRole("ROLE_CONFECTIONER"),
        [decodedToken]
    );

  return { decodedToken, isAdmin, isConfectioner, isCounterEmployee };
};

export default useDecodedToken;