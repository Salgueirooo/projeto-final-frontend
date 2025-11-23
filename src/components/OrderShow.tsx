import { MdYard } from "react-icons/md";
import type { OrderDTO } from "../dto/orderDTO"
import "../styles/OrderShow.css"
import { useState } from "react";
import OrderInfo from "./OrderInfo";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

interface Props {
    order: OrderDTO;
    myOrders: boolean;
    refreshOrders: () => void;
    mode: mode;
}

type mode = "normal" | "pending" | "accepted" | "ready"

const OrderShow: React.FC<Props> = ({order, myOrders, refreshOrders, mode}) => {

    
    const dateTime = order.date.split("T");
    const [modalInfoOpen, setModalInfoOpen] = useState<boolean>(false);

    const {addNotification} = useNotification();

    const setAcceptance = async (acceptance: boolean) => {
        try {
            await api.put(`/order/set-acceptance-status/${order.id}`,
                acceptance
            );
            acceptance ? (
                addNotification("Encomenda aceite.", false)
            ) : (
                addNotification("Encomenda recusada.", false)
            )
            
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

    const setReady = async () => {
        try {
            await api.put(`/order/set-order-ready/${order.id}`);
            addNotification("Encomenda definida como pronta.", false)
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

    const setDelivered = async () => {
        try {
            await api.put(`/order/set-order-delivered/${order.id}`);
            addNotification("Encomenda definida como entregue.", false)
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
            
            <div className="order-container">
                <h4 className="hour"><b>{dateTime[1].slice(0,5)}</b></h4>
                
                <div className="order-body">
                    <h4 className="title1"><b>Lista de Produtos</b></h4>
                    {order.orderDetails.map((orderDetail) => 
                        <h4 key={orderDetail.id}>{orderDetail.quantity}&nbsp;<b>x</b>&nbsp;{orderDetail.productName}</h4>
                    )}
                </div>
                {myOrders ? (
                    <h4 className="client"><b>Estado:</b>&nbsp;{order.orderState}</h4>
                ) : (
                    <h4 className="client" title={order.userName}><b>Cliente:</b>&nbsp;{order.userName}</h4>
                )}

                {(mode==="normal") && (
                    <button className="info" onClick={() => setModalInfoOpen(true)}>+ Informação</button>
                )}
                
                {(!myOrders && mode==="pending") && (
                    <>
                        <button className="info-acceptance" onClick={() => setModalInfoOpen(true)}>+ Informação</button>
                        <div className="op-acceptance">
                            <button className="recuse" onClick={() => setAcceptance(false)}>Recusar</button>
                            <button className="accept" onClick={() => setAcceptance(true)}>Aceitar</button>
                        </div>
                    </>
                )}
                {((!myOrders && mode==="accepted") || (!myOrders && mode==="ready")) && (
                    <>
                        <button className="info-acceptance" onClick={() => setModalInfoOpen(true)}>+ Informação</button>
                        {mode==="accepted" && (
                            <button className="info" onClick={() => setReady()}>Definir como Pronta</button>
                        )}
                        {mode==="ready" && (
                            <button className="info" onClick={() => setDelivered()}>Definir como Entregue</button>
                        )}
                        
                    </>
                )}
                
            </div>
            {modalInfoOpen && <OrderInfo order={order} onSwitch={(m) => setModalInfoOpen(m)} myOrder={myOrders} refreshOrders={refreshOrders}/>}
        </>
        
    )
}

export default OrderShow