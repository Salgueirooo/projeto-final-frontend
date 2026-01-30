import { Navigate, useParams } from "react-router-dom";
import { type JSX } from "react";
import { HomeTabsPermissions } from "../hooks/HomeTabPermissions";
import useDecodedToken from "../hooks/hookDecodedToken";

interface Props {
    children: JSX.Element;
}

const ProtectedTab: React.FC<Props> = ({ children }) => {
    const { tab } = useParams();
    const { decodedToken, loading } = useDecodedToken();

    if (loading) return null;

    if (!tab) {
        return <Navigate to="/select-bakery" replace />;
    }

    const requiredRole = HomeTabsPermissions[tab];

    if (!requiredRole) {
        return <Navigate to="/select-bakery" replace />;
    }

    if (!decodedToken || !decodedToken.roles?.includes(requiredRole)) {
        return <Navigate to="/select-bakery" replace />;
    }

    return children;
};

export default ProtectedTab;