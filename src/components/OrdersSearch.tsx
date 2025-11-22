import type { OrderDTO } from "../dto/orderDTO"
import OrderShow from "./OrderShow"
import "../styles/SearchOrders.css"
import { IoSearch } from "react-icons/io5"
import { useEffect, useState } from "react"
import { useSelectedBakery } from "../hooks/hookSelectBakery"
import api from "../services/api"
import { useNotification } from "../context/NotificationContext"


const SearchOrders: React.FC = () => {

    const [date, setDate] = useState<string>("");
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);

    const bakery = useSelectedBakery();
    const {addNotification} = useNotification();

    const [orders, setOrders] = useState<OrderDTO[]>([]);

    useEffect (() => {
        const getOrder = async () => {
            try {
                setLoadingOrder(true);
                if(bakery !== null && date.length === 10) {
                    const response = await api.get(`/order/search-day-by-user/${bakery.id}`,
                        {params: {date}});
                    setOrders(response.data);
                }
                
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } finally {
                setLoadingOrder(false);
            }
        };

        getOrder();
    }, [bakery, date]);

    const groupOrdersByHour = (orders: OrderDTO[]) => {
        return orders.reduce((groups: Record<string, OrderDTO[]>, order) => {
            const date = new Date(order.date);
            const hour = date.getHours().toString().padStart(2, "0") + ":00";

            if (!groups[hour]) groups[hour] = [];
            groups[hour].push(order);

            return groups;
        }, {});
    };

    const grouped = groupOrdersByHour(orders);

    return (
        <>
             <div className="space-search-order-bar">
                <div className="search-order-box">
                    <input className="search-order-text"
                        type="date"
                        id="name"
                        placeholder='O que procura?'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="orders-container">
                {loadingOrder ? (
                    <div className="spinner"></div>
                ) : (
                    orders.length === 0 ? (
                        date.length < 10 ? (
                            <h3>Indique a data da encomenda.</h3>
                        ) : (
                            <h3>Não foram encontradas encomendas para essa data.</h3>
                        )
                        
                    ) : (
                        
                        Object.entries(grouped).map(([hour, orders]) => (
                            <div key={hour}>
                                <h2>{hour} - {hour.replace(":00", ":59")}</h2>

                                <div className="orders-group">
                                    {orders.map((order) => (
                                        <OrderShow key={order.id + order.date} order={order} myOrders={true} />
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

export default SearchOrders