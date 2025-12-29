import type { OrderDTO } from "../dto/orderDTO"
import OrderShow from "./OrderShow"
import "../styles/SearchOrders.css"
import { IoSearch } from "react-icons/io5"
import { useEffect, useState } from "react"
import api from "../services/api"
import { useToastNotification } from "../context/NotificationContext"
import { getStringDay } from "../hooks/hookStringDay"
import { getTodayDate } from "../hooks/hookTodayDate"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { HomeTab } from "../hooks/HomeTab"
import { useWebSocket } from "../context/WebSocketContext"
import { groupOrdersByDay } from "../hooks/hookGroupOrdersByDay"


const SearchAllOrders: React.FC = () => {

    const navigate = useNavigate();
    const { bakeryId } = useParams<string>();
    const [params] = useSearchParams();

    const initialDate = params.get("date") ?? "";
    const initialEmail = params.get("email") ?? "";

    const todayDate = getTodayDate();

    const [date, setDate] = useState<string>(initialDate);
    const [email, setEmail] = useState<string>(initialEmail);
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [dateSearched, setDateSearched] = useState<string>("");
    const [searched, setSearched] = useState(true);

    const {addToastNotification: addNotification} = useToastNotification();

    const [orders, setOrders] = useState<OrderDTO[]>([]);

    const [reload, setReload] = useState(false);

    const refreshOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const params = new URLSearchParams();

        if (date)
            params.append("date", date);

        if (email) 
            params.append("email", email);

        const queryString = params.toString();

        navigate(
            `/home/${bakeryId}/${HomeTab.SearchAllOrders}${
                queryString ? `?${queryString}` : ""
            }`
        );
        
        setSearched(true);
        setReload(prev => !prev);
    };

    const refreshOrderNoArg = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                searched && setLoadingOrder(true);
                if (email.length >= 1) {
                    const response = await api.get(`/order/search-email-day/${bakeryId}`,
                        {params: {date, email}});
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
        
        if (lastMessage.path?.some(p => p === fullPath)) {
            refreshOrderNoArg();
        }
    }, [messages]);

    const groupedByDay = groupOrdersByDay(orders);

    return (
        <>
            <div className="order-container-header">
                <h2>{getStringDay(dateSearched, todayDate)}</h2> 
                <form className="space-search-order-bar" onSubmit={refreshOrder}>
                    <div className="search-order-box-ready">
                        <input className="search-order-text"
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <input className="search-order-name"
                            type="email"
                            id="name"
                            value={email}
                            placeholder="Insira o email do cliente"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={email.length < 1}><IoSearch /></button>
                </form>
            </div>
            
            <div className="orders-container">
                {loadingOrder ? (
                    <div className="spinner"></div>
                ) : (
                    orders.length === 0 ? (
                        dateSearched.length === 10 ? (
                            <h3>Não foram encontradas encomendas para essa data.</h3>
                        ) : (
                            <h3>Indique o email do cliente e, opcionalmente, a data da encomenda.</h3>
                        )
                        
                    ) : (
                        
                        Object.entries(groupedByDay).map(([day, orders]) => (
                            <div key={day}>
                                {!dateSearched && <h2>{day}</h2>}

                                <div className="orders-group">
                                    {orders.map((order) => (
                                        <OrderShow key={order.id + order.date} order={order} myOrders={false} refreshOrders={() => refreshOrderNoArg()} mode="normal"/>
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

export default SearchAllOrders