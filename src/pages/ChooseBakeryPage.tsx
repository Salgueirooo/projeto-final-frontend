import type { bakeryDTO } from "../dto/bakeryDTO";
import "../styles/ChooseBakery.css"

import SelectBakery from "../components/BakerySelect";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useLogout } from "../services/logout";
import { TbLogout } from "react-icons/tb";
import { FaBell } from "react-icons/fa";
import { IoCog } from "react-icons/io5";
import useDecodedToken from "../hooks/hookDecodedToken";
import NotificationWSList from "../components/NotificationWSList";
import { useNotificationStore } from "../hooks/hookNotificationStore";
import { BiLineChart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { SettingsTab } from "../hooks/SettingsTab";

const SelectBakeryPage: React.FC = () => {
    
    const { isAdmin } = useDecodedToken();

    const { addToastNotification: addNotification } = useToastNotification();
    const [username, setUsername] = useState<string>("");
    
    useEffect(() => {
        const getUsername = async () => {
            try {
                const response = await api.get("/user/get-username");
                setUsername(response.data);
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            }
        };

        getUsername();
    }, []);

    const [bakeries, setBakeries] = useState<bakeryDTO[]>([]);

    const [loadingBakeries, setLoadingBakeries] = useState<boolean>(false);

    useEffect (() => {
        const getBakeries = async () => {
            try {
                setLoadingBakeries(true);
                const response = await api.get("/bakery/all");
                setBakeries(response.data);
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } finally {
                setLoadingBakeries(false);
            }
        };

        getBakeries();
    }, []);

    const [openNotifications, setOpenNotifications] = useState<boolean>(false);
    const lastAccess = localStorage.getItem("lastAccessNotifications");

    const { getAll } = useNotificationStore();
    const [newNotification, setNewNotification] = useState(0);
    const notifications = getAll();
    
    useEffect(() => {
        const newNotificationsCount = lastAccess
            ? notifications.filter(n => new Date(n.time) > new Date(lastAccess)).length
            : notifications.length;
        setNewNotification(newNotificationsCount);
    }, [getAll, openNotifications]);

    
    const navigate = useNavigate();
    const haddleLogout = useLogout();

    return (
        <>  
            <div className="top-bar">
                <span className="top-short">BakeTec</span>
                <span className="top-long">BakeTec - Sistema de Gestão de Pastelarias</span>
                
                {isAdmin && (
                    <>
                        <button className="conf" onClick={() => navigate(`/settings/${SettingsTab.Bakeries}`)}><IoCog /></button> 
                        <button className="stat" onClick={() => navigate("/statistics")}><BiLineChart /></button> 
                    </>
                )}
                
                <button className={openNotifications ? ("notifications-selected") : ("notifications")} onClick={() => setOpenNotifications(true)}><FaBell /></button>
                {newNotification > 0 && (
                    <div className="new-notif">{newNotification}</div>
                )}
                <button className="logout" onClick={haddleLogout}><TbLogout /></button>
            </div>
            <div className="back-select">
                <div className="select-header"><h2>Bem-vindo, {username}! Selecione uma Pastelaria.</h2></div>
                <div className="bakery-container">
                    {loadingBakeries ? (
                        <div className="spinner"></div>
                    ) : (
                        bakeries.length === 0 ? (
                            <h3>Nenhuma Pastelaria encontrada.</h3>
                        ) : (
                            bakeries.map((bakery) => (
                            <SelectBakery key={bakery.id} bakery={bakery} />
                        )))
                        
                    )}
                    
                </div>
            </div>
            
            {openNotifications && (
                <NotificationWSList mode={"main"} onSwitch={(m) => setOpenNotifications(m)} lastAccess={lastAccess}/>
            )}
            
        </>
    )
}

export default SelectBakeryPage