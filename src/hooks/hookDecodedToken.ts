import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useDecodedToken = () => {
    const [decodedToken, setDecodedToken] = useState<any>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setDecodedToken(decoded);
            } catch (err) {
                console.error("Token inválido: ", err);
            }
        } else {
            console.error("Token não encontrado.");
        }
    }, []);

  return { decodedToken };
};

export default useDecodedToken;