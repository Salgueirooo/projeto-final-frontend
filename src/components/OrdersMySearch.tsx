import type { OrderDTO } from "../dto/orderDTO"
import OrderShow from "./OrderShow"
import "../styles/SearchOrders.css"
import { IoSearch } from "react-icons/io5"
import { useEffect, useState } from "react"
import { useSelectedBakery } from "../hooks/hookSelectBakery"
import api from "../services/api"
import { useNotification } from "../context/NotificationContext"
import { groupOrdersByHour } from "../hooks/hookGroupOrdersByHour"
import { getStringDay } from "../hooks/hookStringDay"
import { getTodayDate } from "../hooks/hookTodayDate"


const SearchMyOrders: React.FC = () => {

    const todayDate = getTodayDate();
    const [date, setDate] = useState<string>("");
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [dateSearched, setDateSearched] = useState<string>("");

    const bakery = useSelectedBakery();
    const {addNotification} = useNotification();

    const [orders, setOrders] = useState<OrderDTO[]>([]);

    const [reload, setReload] = useState(false);

    const refreshOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setReload(prev => !prev);
    };

    const refreshOrderNoArg = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                setLoadingOrder(true);
                if(bakery !== null && date.length === 10) {
                    const response = await api.get(`/order/search-day-by-user/${bakery.id}`,
                        {params: {date}});
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
                setLoadingOrder(false);
            }
        };

        getOrder();
    }, [bakery, reload]);

    const grouped = groupOrdersByHour(orders);

    return (
        <>
            <div className="order-container-header">
                <h2>{getStringDay(dateSearched, todayDate)}</h2>
                <form className="space-search-order-bar" onSubmit={refreshOrder}>
                    <div className="search-order-box">
                        <input className="search-order-text"
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={date.length !== 10}><IoSearch /></button>
                </form>
            </div>
            
            <div className="orders-container">
                {loadingOrder ? (
                    <div className="spinner"></div>
                ) : (
                    orders.length === 0 ? (
                        date.length < 10 || !reload ? (
                            <h3>Indique a data da encomenda.</h3>
                        ) : (
                            reload && (<h3>Não foram encontradas encomendas para essa data.</h3>)
                        )
                        
                    ) : (
                        
                        Object.entries(grouped).map(([hour, orders]) => (
                            <div key={hour}>
                                <h2>{hour} - {hour.replace(":00", ":59")}</h2>

                                <div className="orders-group">
                                    {orders.map((order) => (
                                        <OrderShow key={order.id + order.date} order={order} myOrders={true} refreshOrders={() => refreshOrderNoArg()} mode="normal"/>
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

export default SearchMyOrders