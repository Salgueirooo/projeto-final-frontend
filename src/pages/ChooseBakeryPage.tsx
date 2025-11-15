import type { bakeryDTO } from "../dto/bakeryDTO";
import "../styles/ChooseBakery.css"

import BakeryInfo from "../components/BakeryInfo"
import SelectBakery from "../components/BakerySelect";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
import { useLogout } from "../services/logout";
import { TbLogout } from "react-icons/tb";
import { FaCog } from "react-icons/fa";
import { IoCog } from "react-icons/io5";
import useDecodedToken from "../hooks/hookToken";

const SelectBakeryPage: React.FC = () => {
    
    const { decodedToken } = useDecodedToken();
    const isAdmin: boolean = decodedToken?.roles?.includes("ROLE_ADMIN");

    const { addNotification } = useNotification();
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

    const haddleLogout = useLogout();

    return (
        <>
            <div className="top-bar">
                <span className="top-short">BakeTec</span>
                <span className="top-long">BakeTec - Sistema de Gestão de Pastelarias</span>
                {isAdmin && (
                   <button className="conf"><IoCog /></button> 
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
        </>
    )
}

export default SelectBakeryPage