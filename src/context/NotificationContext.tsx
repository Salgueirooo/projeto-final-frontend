import React, { createContext, useContext, useRef, useState } from "react";
import Notification, { type NotificationDTO } from "../components/Notification";

interface NotificationContextType {
  addNotification: (message: string, isError: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification deve ser usado dentro de NotificationProvider");
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

    const nextId = useRef(0);

    const addNotification = (message: string, isError: boolean) => {
        const newNotification: NotificationDTO = {
            id: (nextId.current++).toString(),
            message,
            date: new Date().toLocaleTimeString(),
            isError
        };

        setNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
            setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id)
            );
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
        {children}
        <div className="notification-sidebar">
            {notifications.map((n) => (
                <Notification key={n.id} notification={n} />
            ))}
        </div>
        </NotificationContext.Provider>
    );
};
