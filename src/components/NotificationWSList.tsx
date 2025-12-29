import { useEffect, useState } from "react";
import { useNotificationStore } from "../hooks/hookNotificationStore";
import type { wsMessageDTO } from "../dto/wsMessageDTO";
import "../styles/NotificationWSList.css"
import { useNavigate } from "react-router-dom";

type mode = "main" | "bakery"
type show = "all" | "toBakery" | "toUser"

interface Props {
    mode: mode;
    bakeryId?: number;
    onSwitch: (modalOpen: boolean) => void;
    lastAccess: string | null;
}

const NotificationWSList: React.FC<Props> = ({ mode, bakeryId, onSwitch, lastAccess }) => {

    const navigate = useNavigate();
    const { getByBakery, getAll, getUserNotifications } = useNotificationStore();
    
    const [notifications, setNotifications] = useState<wsMessageDTO[]>([]);        
    const [showMode, setShowMode] = useState<show>("all");
    
    useEffect(() => {
        if (showMode === "all") {
            setNotifications(getAll());
        } else if (showMode === "toBakery" && bakeryId !== undefined) {
            setNotifications(getByBakery(bakeryId));
        } else {
            setNotifications(getUserNotifications());
        }
    }, [getAll, getByBakery, showMode]);

    const newNotifications = (lastAccess
        ? notifications.filter(n => new Date(n.time) > new Date(lastAccess))
        : notifications
    ).reverse();

    const oldNotifications = (lastAccess
        ? notifications.filter(n => new Date(n.time) <= new Date(lastAccess))
        : []
    ).reverse();

    return(
        <>
            <div className="back-modal-not" onClick={() => {onSwitch(false); localStorage.setItem("lastAccessNotifications", new Date().toISOString());}}>
                
                <div className="notification-container" onClick={(e) => e.stopPropagation()}>
                    
                    {mode === "bakery" && (
                        <div className="button-box">
                            <button className={showMode === "all" ? ("selected") : ("non-selected")} onClick={() => setShowMode("all")}>Todas</button>
                            <button className={showMode === "toBakery" ? ("selected") : ("non-selected")} onClick={() => setShowMode("toBakery")}>Pastelaria</button>
                            <button className={showMode === "toUser" ? ("selected") : ("non-selected")} onClick={() => setShowMode("toUser")}>Minhas</button>
                        </div>
                    )}
                    

                    {notifications.length > 0 ? (
                        <>
                            {newNotifications.length > 0 && (
                                <>
                                    {newNotifications.map((notification) => {
                                        const { hyperlink, path } = notification;
                                        const hasValidPath = Array.isArray(path) &&  path.length > 0 && typeof path[0] === "string";
                                        
                                        return (
                                            <div key={notification.time} className="new-notif-box">
                                                {notification.bakeryName ? (<h4>{notification.bakeryName}</h4>) : (<h4>Para mim</h4>)}
                                                <h2>
                                                    {notification.message}
                                                    {hyperlink && hasValidPath && (
                                                        <span
                                                            className="notif-link"
                                                            onClick={() => {onSwitch(false); localStorage.setItem("lastAccessNotifications", new Date().toISOString());; navigate(path[0]);}}
                                                        >
                                                            {hyperlink}
                                                        </span>
                                                    )}
                                                </h2>
                                                <h4>{notification.time.split(" ")[1]}</h4>
                                            </div>
                                        )
                                    })}
                                    <div className="line"></div>
                                </>
                            )}
                            {oldNotifications.length > 0 && (
                                
                                oldNotifications.map((notification) => {
                                    const { hyperlink, path } = notification;
                                    const hasValidPath = Array.isArray(path) &&  path.length > 0 && typeof path[0] === "string";
                                    
                                    return (
                                        <div key={notification.time} className="notif-box">
                                            {notification.bakeryName ? (<h4>{notification.bakeryName}</h4>) : (<h4>Para mim</h4>)}
                                            <h2>
                                                {notification.message}
                                                {hyperlink && hasValidPath && (
                                                    <span
                                                        className="notif-link"
                                                        onClick={() => {onSwitch(false); localStorage.setItem("lastAccessNotifications", new Date().toISOString()); navigate(path[0])}}
                                                    >
                                                        {hyperlink}
                                                    </span>
                                                )}
                                                
                                            </h2>
                                            <h4>{notification.time.split(" ")[1]}</h4>
                                        </div>
                                    )
                                })
                                
                            )}
                        </>
                        
                    ) : (
                        <h2 className="notif-not-found">Sem notificações para mostrar.</h2>
                    )}
                    
                </div>
                
                
            </div>
        </>
    )
}

export default NotificationWSList