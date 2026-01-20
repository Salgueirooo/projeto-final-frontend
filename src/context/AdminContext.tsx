import { Outlet } from "react-router-dom";
import Security from "./SecurityContext";

const AdminLayout = () => (
    <Security allowedRoles={["ROLE_ADMIN"]}>
        <Outlet />
    </Security>
);

export default AdminLayout