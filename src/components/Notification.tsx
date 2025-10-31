import React from "react";
import "../styles/Notification.css";


export interface NotificationDTO {
    id: string;
    date?: string;
    isError: boolean;
    message: string;
}


interface NotificationProps {   
    notification: NotificationDTO;
}

const Notification: React.FC<NotificationProps> = ({ notification}) => {
    return (
        <div className={
                notification.isError
                ? "notification-error"
                : "notification-info"
            }>
            <div className="notification-date">{notification.date}</div>
            <div className="notification-message">{notification.message}</div>
        </div>
    );
};

export default Notification;