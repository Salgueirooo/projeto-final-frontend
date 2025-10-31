import React, { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNotification } from './NotificationContext';

interface SecurityElem {
    allowedRoles: string[];
    children: JSX.Element;
}

const Security: React.FC<SecurityElem> = ({ allowedRoles, children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')?.trim();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const { addNotification } = useNotification();

    useEffect(() => {
    if (!token || token.split('.').length !== 3) {
      console.error('Invalid token structure:', token);
      addNotification("Token inválido!", true);
      navigate('/');
      setIsAuthorized(false);
      return;
    }

    let decodedToken: any;
    try {
        decodedToken = jwtDecode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        addNotification("Token inválido!", true);
        navigate('/');
        setIsAuthorized(false);
        return;
    }

    const userRole = decodedToken?.roles;
    if (!userRole) {
        addNotification("Cargo não encontrado!", true);
        navigate('/');
        setIsAuthorized(false);
        return;
    }

    const hasAccess = allowedRoles.some((role: string) => userRole.includes(role));
    if (!hasAccess) {
        addNotification("Cargo não permitido!", true);
        navigate('/');
        setIsAuthorized(false);
        return;
    }

    setIsAuthorized(true);
  }, []);

  if (isAuthorized) {
    return children;
  }

    return null;
};

export default Security;