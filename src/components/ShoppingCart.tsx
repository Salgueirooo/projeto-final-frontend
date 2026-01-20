import { useEffect, useState } from "react"
import "../styles/ShoppingCart.css"
import MakeOrderForm from "./MakeOrderForm"
import { useToastNotification } from "../context/NotificationContext"
import type { OrderInCartDTO } from "../dto/orderInCartDTO"
import api from "../services/api"

import { FaMinus, FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa"
import UpdateProductQuantityForm from "./UpdateProductQuantityForm"
import { useParams } from "react-router-dom"

const ShoppingCart: React.FC = () => {

    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [order, setOrder] = useState<OrderInCartDTO>({
        id: 0,
        orderDetailsList: []
    });
    const {addToastNotification: addNotification} = useToastNotification();

    const { bakeryId } = useParams<string>();

    const [reload, setReload] = useState(false);

    const refreshOrder = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                setLoadingOrder(true);
                const response = await api.get(`/order/order-in-cart/${bakeryId}`);
                setOrder(response.data);
                
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
    }, [reload]);

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
                                                <td className="price-unit">{orderDetails.price.toFixed(2).replace(".", ",")}</td>
                                                <td className="quantity">
                                                    <button onClick={() => removeOne(Number(bakeryId), orderDetails.productId)}>
                                                        {orderDetails.quantity === 1 ? (<FaTrashAlt />) : (<FaMinus />)}
                                                        
                                                        
                                                    </button>
                                                    <span>{orderDetails.quantity}</span>
                                                    <button className="edit" onClick={() => {
                                                        setUpgradeQuantityFormOpen(true);
                                                        setOrderDetailsId(orderDetails.id);
                                                        }}><FaPencilAlt /></button>
                                                    <button onClick={() => addOne(Number(bakeryId), orderDetails.productId)}><FaPlus /></button>
                                                </td>
                                                <td className="discount">{orderDetails.discount}</td>
                                                <td className="price">
                                                    {(
                                                        (orderDetails.price - (orderDetails.price * orderDetails.discount / 100)) * orderDetails.quantity
                                                    ).toFixed(2).replace(".", ",")}
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
                        <b>Valor total:</b>&nbsp;&nbsp;€{total.toFixed(2).replace(".", ",")}
                    </div>
                </div>
            
            </div>
            {modalFormOpen && (<MakeOrderForm orderId={order.id} onSwitch={(m) => setModalFormOpen(m)}/>)}
            {upgradeQuantityFormOpen && (<UpdateProductQuantityForm mode="update-cart" orderDetailsId={orderDetailsId} refreshOrder={() => refreshOrder()} openForm={(f) => setUpgradeQuantityFormOpen(f)}/>)}
        </>
        
    )
}
export default ShoppingCart