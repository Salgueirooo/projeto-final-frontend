import { MdYard } from "react-icons/md";
import type { OrderDTO } from "../dto/orderDTO"
import "../styles/OrderShow.css"
import { useState } from "react";
import OrderInfo from "./OrderInfo";

interface Props {
    order: OrderDTO;
    myOrders: boolean
}

const OrderShow: React.FC<Props> = ({order, myOrders}) => {

    const dateTime = order.date.split("T");
    const [modalInfoOpen, setModalInfoOpen] = useState<boolean>(false);

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

                <button onClick={() => setModalInfoOpen(true)}>+ Informação</button>
                
            </div>
            {modalInfoOpen && <OrderInfo order={order} onSwitch={(m) => setModalInfoOpen(m)} />}
        </>
        
    )
}

export default OrderShow