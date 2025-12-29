import { Outlet } from "react-router-dom";
import Security from "./SecurityContext";
import { WebSocketProvider } from "./WebSocketContext";

const  roles = ["ROLE_ADMIN", "ROLE_CONFECTIONER", "ROLE_COUNTER_EMPLOYEE", "ROLE_CLIENT"];

const AuthenticatedLayout = () => (
    <Security allowedRoles={roles}>
        <WebSocketProvider>
            <Outlet />
        </WebSocketProvider>
    </Security>
);

export default AuthenticatedLayout