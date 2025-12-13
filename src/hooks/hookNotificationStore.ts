import { useContext } from "react";
import NotificationStoreContext from "../context/NotificationStoreContext";

export const useNotificationStore = () => {
    const ctx = useContext(NotificationStoreContext);
    if (!ctx) throw new Error("useNotificationStore must be used inside provider");
    return ctx;
};