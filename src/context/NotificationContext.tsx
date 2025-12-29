import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Notification, { type NotificationDTO } from "../components/NotificationToast";
import type { wsMessageDTO } from "../dto/wsMessageDTO";

interface NotificationContextType {
  addToastNotification: (message: string, isError: boolean, data?: wsMessageDTO) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useToastNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification deve ser usado dentro de NotificationProvider");
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const nextId = useRef(0);

    useEffect(() => {
        if (!sidebarRef.current) return;

        sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
    }, [notifications]);

    const addToastNotification = (message: string, isError: boolean, data?: wsMessageDTO) => {
        const newNotification: NotificationDTO = {
            id: (nextId.current++).toString(),
            message,
            date: new Date().toLocaleTimeString(),
            isError,
            data
        };

        setNotifications((prev) => [newNotification, ...prev]);

        setTimeout(() => {
            setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id)
            );
        }, 5000);
    };

    return (
        <NotificationContext.Provider value={{ addToastNotification: addToastNotification }}>
        {children}
        <div className="notification-sidebar" ref={sidebarRef}>
            {notifications.map((n) => (
                <Notification key={n.id} notification={n} />
            ))}
        </div>
        </NotificationContext.Provider>
    );
};
