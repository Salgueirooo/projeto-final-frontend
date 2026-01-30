import type { OrderDTO } from "../dto/orderDTO"
import OrderShow from "./OrderShow"
import "../styles/SearchOrders.css"
import { IoSearch } from "react-icons/io5"
import { useEffect, useState } from "react"
import api from "../services/api"
import { useToastNotification } from "../context/NotificationContext"
import { getStringDay } from "../hooks/hookStringDay"
import { getTodayDate } from "../hooks/hookTodayDate"
import { groupOrdersByHour } from "../hooks/hookGroupOrdersByHour"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { HomeTab } from "../hooks/HomeTab"
import { useWebSocket } from "../context/WebSocketContext"


const SearchOrdersReady: React.FC = () => {

    const navigate = useNavigate();
    const { bakeryId } = useParams<string>();
    const [params] = useSearchParams();
    
    const todayDate = getTodayDate();
    const initialDate = params.get("date") ?? (todayDate);
    const initialUsername = params.get("username") ?? "";

    const [date, setDate] = useState<string>(initialDate);
    const [username, setUsername] = useState<string>(initialUsername);
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [dateSearched, setDateSearched] = useState<string>(initialDate);
    const [searched, setSearched] = useState(true);

    const {addToastNotification: addNotification} = useToastNotification();

    const [orders, setOrders] = useState<OrderDTO[]>([]);

    const [reload, setReload] = useState(false);

    const buildParams = () => {
        const p = new URLSearchParams();
        p.append("date", date);
        if (username.trim() !== "") p.append("username", username);
        return p.toString();
    };

    const refreshOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setReload(prev => !prev);
        setSearched(true);
    };

    const refreshOrderNoArg = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                searched && setLoadingOrder(true);
                if(date.length === 10) {
                    navigate(`/home/${bakeryId}/${HomeTab.ReadyOrders}?${buildParams()}`);
                    const response = await api.get(`/order/get-ready-by-date/${bakeryId}`,
                        {params: {date, username}});
                    
                    setOrders(response.data);
                    setDateSearched(date);
                }
                
            } catch (err: any) {

                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);

                }
            } finally {
                searched && setLoadingOrder(false);
                setSearched(false);
            }
        };

        getOrder();
    }, [reload]);

    const location = useLocation();
    const { messages } = useWebSocket();
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const fullPath = location.pathname + location.search;
        
        console.log(location.pathname);
        console.log(lastMessage.path);
        
        if (lastMessage.path?.some(p => p === fullPath)) {
            refreshOrderNoArg();
        }
    }, [messages]);

    const grouped = groupOrdersByHour(orders);

    return (
        <>
            <div className="order-container-header">
                <h2 className="day-ready">{getStringDay(dateSearched, todayDate)}</h2> 
                <form className="space-search-order-bar-2" onSubmit={refreshOrder}>
                    <div className="search-order-box-ready">
                        <input className="search-order-text"
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <input className="search-order-name"
                            type="text"
                            id="name"
                            value={username}
                            placeholder="Insira o nome do cliente (opcional)"
                            onChange={(e) => setUsername(e.target.value)}
                            
                        />
                    </div>
                    <button type="submit" disabled={date.length !== 10}><IoSearch /></button>
                </form>
                <h2 className="day-ready2">{getStringDay(dateSearched, todayDate)}</h2> 
            </div>
            
            <div className="orders-container">
                {loadingOrder ? (
                    <div className="spinner"></div>
                ) : (
                    orders.length === 0 ? (
                        <h3>Não foram encontradas encomendas para essa data.</h3>
                        
                        
                    ) : (
                        
                        Object.entries(grouped).map(([hour, orders]) => (
                            <div key={hour}>
                                <h2>{hour} - {hour.replace(":00", ":59")}</h2>

                                <div className="orders-group">
                                    {orders.map((order) => (
                                        <OrderShow key={order.id + order.date} order={order} myOrders={false} refreshOrders={() => refreshOrderNoArg()} mode="ready"/>
                                    ))}
                                </div>
                            </div>
                        ))
                    )
                    
                )}
            </div>
        </>
    )
}

export default SearchOrdersReady