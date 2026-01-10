import type { OrderDTO } from "../dto/orderDTO"
import "../styles/OrderShow.css"
import { useState } from "react";
import OrderInfo from "./OrderInfo";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { RxCross2 } from "react-icons/rx";
import OrderStatus from "./OrderSetReady";

interface Props {
    order: OrderDTO;
    myOrders: boolean;
    refreshOrders: () => void;
    mode: mode;
    seeState?: boolean;
}

type mode = "normal" | "pending" | "accepted" | "ready"

const OrderShow: React.FC<Props> = ({order, myOrders, refreshOrders, mode, seeState}) => {
    
    const dateTime = order.date.split("T");
    const [modalInfoOpen, setModalInfoOpen] = useState<boolean>(false);
    const [modalRecuseOrder, setModalRecuseOrder] = useState<boolean>(false);
    const [commentary, setCommentary] = useState<string>("");
    const {addToastNotification: addNotification} = useToastNotification();

    const setAcceptance = async (acceptance: boolean) => {
        if (acceptance) {
            try {
            
                await api.put(`/order/set-acceptance-status/${order.id}`,{
                    acceptance
                });
                // addNotification("Encomenda aceite.", false);
            
                //refreshOrders();
        
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
        } else {
            setModalRecuseOrder(true);
        }
    };

    const recuseOrder = async () => {
        
        try {
        
            await api.put(`/order/set-acceptance-status/${order.id}`, {
                acceptance: false,
                staffNotes: commentary
            });
            
            setModalRecuseOrder(false);
    
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

    const [modalReady, setModalReady] = useState(false);

    const setDelivered = async () => {
        try {
            await api.put(`/order/set-order-delivered/${order.id}`);
            addNotification("Encomenda definida como entregue.", false)
            //refreshOrders();
       
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
                    seeState ? (
                        <h4 className="client"><b>Estado:</b>&nbsp;{order.orderState}</h4>
                    ) : (
                        <h4 className="client" title={order.userName}><b>Cliente:</b>&nbsp;{order.userName}</h4>
                    )
                    
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
                            <button className="info" onClick={() => setModalReady(true)}>Definir como Pronta</button>
                        )}
                        {mode==="ready" && (
                            <button className="info" onClick={() => setDelivered()}>Definir como Entregue</button>
                        )}
                        
                    </>
                )}
                
            </div>
            {modalInfoOpen && <OrderInfo order={order} onSwitch={(m) => setModalInfoOpen(m)} myOrder={myOrders} refreshOrders={refreshOrders}/>}
            {modalRecuseOrder && (
                <div className="back-modal" onClick={() => setModalRecuseOrder(false)}>
                    <div className="recuse-order-form" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setModalRecuseOrder(false)}><RxCross2 /></button>
                        
                        <div className="body-recuse">
                            <h2>Indique o motivo da recusa do pedido (opcional)</h2>
    
                            <textarea
                                placeholder="Escreva aqui as notas da sua encomenda..."
                                className="notes-box"
                                value={commentary}
                                onChange={(e) => setCommentary(e.target.value)}>
                            </textarea>
                            
                            <button className="submit" onClick={() => recuseOrder()}>Recusar</button>
                        </div>
                    </div>
                </div>
            )}
            {modalReady && <OrderStatus orderId={order.id} onSwitch={(r) => setModalReady(r)}/>}
        </>
    )
}

export default OrderShow