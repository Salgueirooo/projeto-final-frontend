import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { wsMessageDTO } from "../dto/wsMessageDTO";

interface NotificationStoreContextType {
    allNotifications: wsMessageDTO[];
    notificationsByBakery: Record<number, wsMessageDTO[]>;

    addNotification: (notification: wsMessageDTO) => void;
    getByBakery: (id: number) => wsMessageDTO[];
    getAll: () => wsMessageDTO[];
    getUserNotifications: () => wsMessageDTO[];
    reloadNotifications: () => void;
}

const NotificationStoreContext = createContext<NotificationStoreContextType | null>(null);
export default NotificationStoreContext;

export const NotificationStoreProvider = ({ children }: { children: ReactNode }) => {
    const [allNotifications, setAllNotifications] = useState<wsMessageDTO[]>([]);
    const [notificationsByBakery, setNotificationsByBakery] = useState<Record<number, wsMessageDTO[]>>({});
    const [userNotifications, setUserNotifications] = useState<wsMessageDTO[]>([]);

    const addNotification = (notification: wsMessageDTO) => {
        setAllNotifications((prev) => [...prev, notification]);

        if (typeof notification.bakeryId === "number") {
            const key = notification.bakeryId;

            setNotificationsByBakery((prev) => ({
                ...prev,
                [key]: [...(prev[key] || []), notification]
            }));

        } else {  
            setUserNotifications(prev => [...prev, notification]);
        }
    };

    const getByBakery = (id: number) => {
        return notificationsByBakery[id] || [];
    };

    const getAll = () => allNotifications;

    const getUserNotifications = () => userNotifications;

    const reloadNotifications = () => {
        setAllNotifications([]);
        setNotificationsByBakery({});
        setUserNotifications([]);
    }

    return (
        <NotificationStoreContext.Provider value={{ 
            allNotifications, 
            notificationsByBakery, 
            addNotification, 
            getByBakery, 
            getAll,
            getUserNotifications,
            reloadNotifications
        }}>
            {children}
        </NotificationStoreContext.Provider>
    );
};

