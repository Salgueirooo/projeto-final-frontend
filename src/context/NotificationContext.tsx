import React, { createContext, useContext, useState } from "react";
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

    const addNotification = (message: string, isError: boolean) => {
        const newNotification: NotificationDTO = {
            id: crypto.randomUUID(),
            message,
            date: new Date().toLocaleTimeString(),
            isError
        };

        setNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
            setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id)
            );
        }, 5000);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
        {children}
        <div className="notification-sidebar">
            {notifications.map((n, i) => (
            <Notification key={i} notification={n} />
            ))}
        </div>
        </NotificationContext.Provider>
    );
};
