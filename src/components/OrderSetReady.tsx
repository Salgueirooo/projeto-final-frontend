import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import "../styles/RecipeStartForm.css"
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import type { ProductStockCheckDTO } from "../dto/productStockCheckDTO";

interface Props {
    orderId: number;
    onSwitch: (modalForm: boolean) => void;
}


const OrderStatus: React.FC<Props> = ({orderId, onSwitch}) => {

    const [loadingStock, setLoadingStock] = useState<boolean>(false);
    const [orderStocks, setOrderStocks] = useState<ProductStockCheckDTO[]>([]);
    const {addToastNotification: addNotification} = useToastNotification();

    useEffect (() => {
        const getStocks = async () => {
            try {
                setLoadingStock(true);
                const response = await api.get(`/product-stock/verify-stock-order/${orderId}`);
                setOrderStocks(response.data);
                
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
                setLoadingStock(false);
            }
        };

        getStocks();
    }, []);

    const setReady = async () => {
        try {
            await api.put(`/order/set-order-ready/${orderId}`);
            addNotification("Encomenda definida como pronta.", false)
       
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
        <div className="back-modal" onClick={() => onSwitch(false)}>
            <div className="recipe-start" onClick={(e) => e.stopPropagation()}>
                <button className="close-bot" onClick={() => onSwitch(false)}><RxCross2 /></button>
                
                <table>
                    <thead>
                        <tr>
                            <th className="name">Produto</th>
                            <th className="quantity-stock">Quantidade</th>
                            <th className="sufficient">Suficiente</th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-status">
                    <table className="cart-table">
                        <tbody>

                            {loadingStock ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {orderStocks.map(orderStock => (
                                            <tr key={orderStock.productId}>
                                                <td className="name" title={orderStock.productName}>{orderStock.productName}</td>
                                                <td className="quantity-stock">{orderStock.quantityNeeded} / {orderStock.availableQuantity} un.</td>
                                                <td className={orderStock.sufficient ? "sufficient" : "insufficient"}>{orderStock.sufficient ? (<FaCheck />) : (<ImCross />)}</td>
                                            </tr>
                                    ))} 
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {orderStocks.every(orderStock => orderStock.sufficient !== false) ? (
                    <button className="start-recipe" onClick={() => {setReady(); onSwitch(false)}}>Definir como Pronta</button>
                ) : (
                    <button className="start-recipe" onClick={() => onSwitch(false)}>Cancelar</button>
                )}
                
            </div>
        </div>  
    )
}

export default OrderStatus