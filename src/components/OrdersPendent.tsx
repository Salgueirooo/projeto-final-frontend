import type { OrderDTO } from "../dto/orderDTO"
import OrderShow from "./OrderShow"
import "../styles/SearchOrders.css"
import { useEffect, useState } from "react"
import api from "../services/api"
import { useToastNotification } from "../context/NotificationContext"
import { groupOrdersByDay } from "../hooks/hookGroupOrdersByDay"
import { useLocation, useParams } from "react-router-dom"
import { useWebSocket } from "../context/WebSocketContext"


const OrdersPendent: React.FC = () => {

    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);

    const { bakeryId} = useParams<string>();
    const {addToastNotification: addNotification} = useToastNotification();

    const [orders, setOrders] = useState<OrderDTO[]>([]);

    const location = useLocation();
    const { messages } = useWebSocket();
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const fullPath = location.pathname + location.search;
        
        if (lastMessage.path?.some(p => p === fullPath)) {
            refreshOrder();
        }
    }, [messages]);

    const [reload, setReload] = useState(false);

    const refreshOrder = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                orders.length === 0 && setLoadingOrder(true);
                
                const response = await api.get(`/order/get-all-pending/${bakeryId}`);
                setOrders(response.data);
                
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
                orders.length === 0 && setLoadingOrder(false);
            }
        };

        getOrder();
    }, [reload]);

    const grouped = groupOrdersByDay(orders);

    return (
        <>
            <div className="all-orders-container">
                {loadingOrder ? (
                    <div className="spinner"></div>
                ) : (
                    orders.length === 0 ? (
                        <h3>Não foram encontradas encomendas pendentes.</h3>
                    ) : (
                        Object.entries(grouped).map(([day, orders]) => (
                            <div key={day}>
                                <h2 className="day">{day}</h2>

                                <div className="orders-group">
                                    {orders.map((order) => (
                                        <OrderShow key={order.id + order.date} order={order} myOrders={false} refreshOrders={() => refreshOrder()} mode="pending" />
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

export default OrdersPendent