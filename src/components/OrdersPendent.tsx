import type { OrderDTO } from "../dto/orderDTO"
import OrderShow from "./OrderShow"
import "../styles/SearchOrders.css"
import { IoSearch } from "react-icons/io5"
import { useEffect, useState } from "react"
import { useSelectedBakery } from "../hooks/hookSelectBakery"
import api from "../services/api"
import { useNotification } from "../context/NotificationContext"
import { groupOrdersByDay } from "../hooks/hookGroupOrdersByDay"


const OrdersPendent: React.FC = () => {

    
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);

    const bakery = useSelectedBakery();
    const {addNotification} = useNotification();

    const [orders, setOrders] = useState<OrderDTO[]>([]);

    const [reload, setReload] = useState(false);

    const refreshOrder = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                setLoadingOrder(true);
                if(bakery !== null) {
                    const response = await api.get(`/order/get-all-pending/${bakery.id}`);
                    setOrders(response.data);
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

    const grouped = groupOrdersByDay(orders);

    return (
        <>
            
            <div className="all-orders-container">
                {loadingOrder ? (
                    <div className="spinner"></div>
                ) : (
                    orders.length === 0 ? (
                        <h3>Não foram encontradas encomendas para essa data.</h3>
                        
                        
                    ) : (
                        
                        Object.entries(grouped).map(([day, orders]) => (
                            <div key={day}>
                                <h2>{day}</h2>

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