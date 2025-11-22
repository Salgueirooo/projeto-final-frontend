import { RxCross2 } from "react-icons/rx";
import { useNotification } from "../context/NotificationContext";
import type { OrderDTO } from "../dto/orderDTO";
import "../styles/OrderInfo.css"

interface Props {
    onSwitch: (modalOpen: boolean) => void;
    order: OrderDTO;
}

const OrderInfo: React.FC<Props> = ({onSwitch, order}) => {

    const { addNotification } = useNotification();

    const date = order.date.replace("T", " - ").slice(0, 18);
    const total = order.orderDetails.reduce((sum, product) => {
        const priceWithDiscount = product.price - (product.price * product.discount / 100);
        return sum + (priceWithDiscount * product.quantity);
    }, 0);

    return (
        <>
            <div className="back-modal" onClick={() => onSwitch(false)}>
                                        
                <div className="order" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onSwitch(false)}><RxCross2 /></button>

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
                            <h2 className="username" title={order.userName}><b>N.º da Encomenda:</b>&nbsp;{order.id}</h2>
                        </div>
                        {!order.clientNotes && (
                            <h2 className="text-box"><b>Notas do cliente:</b>&nbsp;{order.clientNotes}</h2>
                        )}
                        <table className="table-header">
                            <thead>
                                <tr>
                                    <th className="name">Produto</th>
                                    <th className="price-unit">Preço Unit. (€)</th>
                                    <th className="quantity">Quant.</th>
                                    <th className="discount">Desc. (%)</th>
                                    <th className="price">Preço (€)</th>
                                </tr>
                            </thead>                  
                        </table>
                        <div className="t-body">
                            <table className="cart-table">
                                <tbody>

                                    {order.orderDetails.map(orderDetails => (
                                        <tr key={orderDetails.id}>
                                            <td className="name" title={orderDetails.productName}>
                                                <span>{orderDetails.productName}</span>
                                            </td>
                                            <td className="price-unit">{orderDetails.price.toFixed(2)}</td>
                                            <td className="quantity">
                                                <span>{orderDetails.quantity}</span>
                                            </td>
                                            <td className="discount">{orderDetails.discount}</td>
                                            <td className="price">
                                                {(
                                                    (orderDetails.price - (orderDetails.price * orderDetails.discount / 100)) * orderDetails.quantity
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))} 
                                    
                                </tbody>
                            </table>
                        </div>
                        <table>
                            <tr className="total-line">
                                <td className="total">Total</td>
                                <td className="price">{total.toFixed(2)}</td>
                            </tr>
                        </table>
                        
                        {!order.staffNotes && (
                            <h2 className="text-box"><b>Notas do staff:</b>&nbsp;{order.clientNotes}</h2>
                        )}
                        <h4 className="requestDate"><b>Pedido feito a:</b> {order.requestedDate.replace("T", " - ").slice(0, 18)}</h4>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderInfo