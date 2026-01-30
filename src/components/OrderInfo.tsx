import { RxCross2 } from "react-icons/rx";
import { useToastNotification } from "../context/NotificationContext";
import type { OrderDTO } from "../dto/orderDTO";
import "../styles/OrderInfo.css"
import api from "../services/api";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";

interface Props {
    onSwitch: (modalOpen: boolean) => void;
    order: OrderDTO;
    myOrder: boolean;
    refreshOrders: () => void;
}

const OrderInfo: React.FC<Props> = ({onSwitch, order, myOrder, refreshOrders}) => {

    const { addToastNotification: addNotification } = useToastNotification();

    const [openModalForm, setOpenModalForm] = useState<boolean>(false);
    const [orderDetailsIdSelected, setOrderDetailsIdSelected] = useState<number | null>(null);

    const date = order.date.replace("T", " - ").slice(0, 18);
    const total = order.orderDetails.reduce((sum, product) => {
        const priceWithDiscount = product.price - (product.price * product.discount / 100);
        return sum + (priceWithDiscount * product.quantity);
    }, 0);

    const [loading, setLoading] = useState(false);
    const [maxHoursToCancel, setMaxHoursToCancel] = useState(48);
    const [maxReviewDays, setMaxReviewDays] = useState(7);

    useEffect(() => {
        const getMaxTime = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/system-config/get`, {params: {key: "MAX_ORDER_CANCEL_HOURS"}});
                setMaxHoursToCancel(Number(response.data));

            } catch (err: any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro ao efetuar a Encomenda.", true);
                }
            } finally {
                setLoading(false);
            }
        }


        if ((order.orderState === "Pendente" && myOrder) || (order.orderState === "Aceite" && myOrder))
            getMaxTime();
            
    }, []);

    useEffect(() => {
        const getMinTime = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/system-config/get`, {params: {key: "MAX_REVIEW_DAYS"}});
                setMaxReviewDays(Number(response.data));

            } catch (err: any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro ao efetuar a Encomenda.", true);
                }
            } finally {
                setLoading(false);
            }
        }


        if ((order.orderState === "Entregue" && myOrder))
            getMinTime();
            
    }, []);

    const isReviewable = (): boolean => {
        const eventDate = new Date(order.date);
        const today = new Date();

        eventDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffInMs = today.getTime() - eventDate.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        return diffInDays <= maxReviewDays;
    };

    const isCancelable = (): boolean => {
        const eventDate = new Date(order.date);
        const now = new Date();

        const diffInMs = now.getTime() - eventDate.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        return diffInHours <= maxHoursToCancel;
    };

    const cancelOrder = async (orderId: number) => {
        try {
            await api.put(`/order/cancel/${orderId}`);
            addNotification("A encomenda foi cancelada.", false);
            onSwitch(false);
            refreshOrders();
       
        } catch (err: any) {

            if(err.response) {
                console.error(err.response.data);
                addNotification(err.response.data, true);
            }
            else {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);

            }
        }
    };

    return (
        <>
            <div className="back-modal" onClick={() => onSwitch(false)}>
                                        
                <div className="order" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onSwitch(false)}><RxCross2 /></button>

                    {loading ? (
                        <div className="spinner"></div>
                    ) : (
                        <div className="order-container">
                            <div className="inline">
                                <h2><b>Data:</b>&nbsp;{date}</h2>
                                <h2><b>Estado:</b>&nbsp;{order.orderState}</h2>
                            </div>
                            <div className="inline">
                                <h2 className="username" title={order.userName}><b>Cliente:</b>&nbsp;{order.userName}</h2>
                                <h2><b>N.º Tel.:</b>&nbsp;{order.phoneNumber}</h2>
                            </div>
                            <div className="inline">
                                <h2><b>N.º da Encomenda:</b>&nbsp;{order.id}</h2>
                                {((order.orderState === "Pendente" && myOrder && isCancelable())  || (order.orderState === "Aceite" && myOrder && isCancelable())) && (
                                    <button className="cancel" onClick={() => cancelOrder(order.id)}>Cancelar encomenda</button>
                                )}
                                
                            </div>
                            {order.clientNotes && (
                                <h2 className="text-box"><b>Notas do cliente:</b>&nbsp;{order.clientNotes}</h2>
                            )}
                            <table className="table-header">
                                <thead>
                                    <tr>
                                        <th className="name">Produto</th>
                                        {order.orderState === "Entregue" && (
                                            <th className="review-col">Avaliar</th>
                                        )}
                                        <th className="price-unit">Preço (€)</th>
                                        <th className="quantity">Quant.</th>
                                        <th className="discount">Desc. (%)</th>
                                        <th className="price">Total (€)</th>
                                    </tr>
                                </thead>                  
                            </table>
                            <div className="t-body">
                                <table className="cart-table">
                                    <tbody>

                                        {order.orderDetails.map(orderDetails => (
                                            <tr key={orderDetails.id}>
                                                <td className="name" title={orderDetails.productName}>
                                                        {orderDetails.productName}
                                                </td>
                                                {order.orderState === "Entregue" && myOrder && (
                                                    <td className="review-col">
                                                        {orderDetails.wasReviewed || !isReviewable() ? (
                                                            <button className="inactive"><FaStar /></button>
                                                        ) : (
                                                            <button onClick={() => {setOpenModalForm(true); setOrderDetailsIdSelected(orderDetails.id)}}><FaStar /></button>
                                                        )}
                                                    </td>
                                                )}
                                                
                                                <td className="price-unit">{orderDetails.price.toFixed(2).replace(".", ",")}</td>
                                                <td className="quantity">
                                                    <span>{orderDetails.quantity}</span>
                                                </td>
                                                <td className="discount">{orderDetails.discount}</td>
                                                <td className="price">
                                                    {(
                                                        (orderDetails.price - (orderDetails.price * orderDetails.discount / 100)) * orderDetails.quantity
                                                    ).toFixed(2).replace(".", ",")}
                                                </td>
                                            </tr>
                                        ))} 
                                        
                                    </tbody>
                                </table>
                            </div>
                            <table>
                                <tbody>
                                    <tr className="total-line">
                                        <td className="total">Total</td>
                                        <td className="price">{total.toFixed(2).replace(".", ",")}</td>
                                    </tr>
                                </tbody>
                                
                            </table>
                            
                            {order.staffNotes && (
                                <h2 className="text-box"><b>Notas do staff:</b>&nbsp;{order.staffNotes}</h2>
                            )}
                            <h4 className="requestDate"><b>Pedido feito a:</b> {order.requestedDate.replace("T", " - ").slice(0, 18)}</h4>
                            
                        </div>
                    )}

                    
                </div>
            </div>
            {openModalForm && (
                <ReviewForm onSwitch={(m) => setOpenModalForm(m)} orderDetailsId={orderDetailsIdSelected} refreshOrders={refreshOrders} />
            )}
        </>
    )
}

export default OrderInfo