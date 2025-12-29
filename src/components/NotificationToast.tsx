import React from "react";
import "../styles/Notification.css";
import type { wsMessageDTO } from "../dto/wsMessageDTO";
import { useNavigate } from "react-router-dom";


export interface NotificationDTO {
    id: string;
    date?: string;
    isError: boolean;
    message: string;
    data?: wsMessageDTO;
}

interface NotificationProps {   
    notification: NotificationDTO;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {

    const navigate = useNavigate();
    const data = notification.data;
    const path = data?.path?.[0];

    return (
        <div className={
                notification.isError
                ? "notification-error"
                : "notification-info"
            }>
            <div className="notification-date">{notification.date}</div>
            <div className="notification-message">
                {notification.message}
                {path && (
                    <span
                        className="notif-link"
                        onClick={() => navigate(path)}
                    >
                        {data?.hyperlink}
                    </span>
                )}
                
            </div>
        </div>
    );
};

export default Notification;