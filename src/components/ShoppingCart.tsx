import { useEffect, useState } from "react"
import type { OrderDetailsDTO } from "../dto/orderDetailsDTO"
import type { productDTO } from "../dto/productDTO"
import "../styles/ShoppingCart.css"
import MakeOrderForm from "./MakeOrderForm"
import { useNotification } from "../context/NotificationContext"
import type { OrderInCartDTO } from "../dto/orderInCartDTO"
import api from "../services/api"
import { useSelectedBakery } from "../hooks/hookSelectBakery"
import { FaMinus, FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa"
import UpdateProductQuantityForm from "./UpdateProductQuantityForm"

//interface para mudar de tela
interface Props {
    onSwitch: (op: number) => void
}

const ShoppingCart: React.FC<Props> = ({onSwitch}) => {

    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [order, setOrder] = useState<OrderInCartDTO>({
        id: 0,
        orderDetailsList: []
    });
    const {addNotification} = useNotification();

    const bakery = useSelectedBakery();

    const [reload, setReload] = useState(false);

    const refreshOrder = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                setLoadingOrder(true);
                if(bakery !== null) {
                    const response = await api.get(`/order/order-in-cart/${bakery.id}`);
                    setOrder(response.data);
                }
                
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } finally {
                setLoadingOrder(false);
            }
        };

        getOrder();
    }, [bakery, reload]);

    const addOne = async (bakeryId: number, productId: number) => {
        try {
            await api.post("/order/add-product", {
                bakeryId: bakeryId,
                productId: productId
            });
            addNotification("A quantidade do produto foi aumentada.", false);
            refreshOrder();
       
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

    const removeOne = async (bakeryId: number, productId: number) => {
        try {
            await api.delete("/order/remove-product", {
                data: {
                    bakeryId: bakeryId,
                    productId: productId
                }
            });
            addNotification("A quantidade do produto foi diminuida.", false);
            refreshOrder();
       
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
    

    const total = order.orderDetailsList.reduce((sum, product) => {
        const priceWithDiscount = product.price - (product.price * product.discount / 100);
        return sum + (priceWithDiscount * product.quantity);
    }, 0);

    const [modalFormOpen, setModalFormOpen] = useState<boolean>(false);
    const [upgradeQuantityFormOpen, setUpgradeQuantityFormOpen] = useState<boolean>(false);
    const [orderDetailsId, setOrderDetailsId] = useState<number>(0);

    return (
        <>
            <div className="show-cart">
            
                <table>
                    <thead>
                        <tr>
                            <th className="name">Produto</th>
                            <th className="price-unit">Preço Unit. (€)</th>
                            <th className="quantity">Quantidade</th>
                            <th className="discount">Desconto (%)</th>
                            <th className="price">Preço (€)</th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body">
                    <table className="cart-table">
                        <tbody>

                            {loadingOrder ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {order.orderDetailsList.length === 0 ? (
                                        <tr>
                                            <td className="name">O carrinho não possui produtos.</td>
                                        </tr>
                                    ) : (
                                        order.orderDetailsList.map(orderDetails => (
                                            <tr key={orderDetails.id}>
                                                <td className="name" title={orderDetails.productName}>{orderDetails.productName}</td>
                                                <td className="price-unit">{orderDetails.price.toFixed(2)}</td>
                                                <td className="quantity">
                                                    <button onClick={() => bakery && removeOne(bakery.id, orderDetails.productId)}>
                                                        {orderDetails.quantity === 1 ? (<FaTrashAlt />) : (<FaMinus />)}
                                                        
                                                        
                                                    </button>
                                                    <span>{orderDetails.quantity}</span>
                                                    <button className="edit" onClick={() => {
                                                        setUpgradeQuantityFormOpen(true);
                                                        setOrderDetailsId(orderDetails.id);
                                                        }}><FaPencilAlt /></button>
                                                    <button onClick={() => bakery && addOne(bakery.id, orderDetails.productId)}><FaPlus /></button>
                                                </td>
                                                <td className="discount">{orderDetails.discount}</td>
                                                <td className="price">
                                                    {(
                                                        (orderDetails.price - (orderDetails.price * orderDetails.discount / 100)) * orderDetails.quantity
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )} 
                                </>
                                
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bot-table">
                    <button onClick={() => setModalFormOpen(true)}>Encomendar</button>

                    <div className="total-price">
                        <b>Valor total:</b>&nbsp;&nbsp;€{total.toFixed(2)}
                    </div>
                </div>
            
            </div>
            {modalFormOpen && (<MakeOrderForm orderId={order.id} onSwitch={(m) => setModalFormOpen(m)} onSwitchOp={(op) => onSwitch(op)}/>)}
            {upgradeQuantityFormOpen && (<UpdateProductQuantityForm orderDetailsId={orderDetailsId} refreshOrder={() => refreshOrder()} openForm={(f) => setUpgradeQuantityFormOpen(f)}/>)}
        </>
        
    )
}
export default ShoppingCart