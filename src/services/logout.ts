import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("tokenChanged"));
        navigate("/");
    };

    return handleLogout;
};
