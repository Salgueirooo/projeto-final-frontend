import { RxCross2 } from "react-icons/rx";
import "../styles/UpdateProductQuantityForm.css"
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useParams } from "react-router-dom";

interface Props {
    openForm: (op: boolean) => void;
    refreshOrder?: () => void;
    orderDetailsId?: number;
    ingredientId?: number;
    productId?: number;
    mode: mode;
    stockType?: stock;
}

type stock = "ingredient" | "product"
type mode = "update-cart" | "update-stock" | "add-stock"

const UpdateProductQuantityForm: React.FC<Props> = ({mode, stockType, refreshOrder, openForm, orderDetailsId, ingredientId, productId}) => {
    const { bakeryId } = useParams<string>();
    const [quantity, setQuantity] = useState<number>(1)
    const {addToastNotification: addNotification} = useToastNotification();
    
    const updateCartQuantity = async (event: React.FormEvent) => {
        event.preventDefault();

        if (orderDetailsId) {
            try {
                await api.put("/order/update-product", {orderDetailsId, quantity});

                addNotification("A quantidade do produto foi atualizada.", false);
                openForm(false);
                refreshOrder && refreshOrder();

            } catch (err: any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro ao atualizar a quantidade do produto.", true);
                }
            }
        }
        
    };

    const updateStockQuantity = async (event: React.FormEvent) => {
        event.preventDefault();

        if (stockType === "ingredient") {
            
            if (ingredientId) {
                try {
                    await api.put(`/stock/update/${bakeryId}/${ingredientId}`, quantity,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    openForm(false);

                } catch (err: any) {
                    if(err.response) {
                        console.error(err.response.data);
                        addNotification(err.response.data, true);
                    }
                    else {
                        console.error(err);
                        addNotification("Erro ao atualizar a quantidade do ingrediente.", true);
                    }
                }
            }

        } else if (stockType === "product") {

            if (productId) {
                try {
                    await api.put(`/product-stock/update/${bakeryId}/${productId}`, quantity,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    openForm(false);

                } catch (err: any) {
                    if(err.response) {
                        console.error(err.response.data);
                        addNotification(err.response.data, true);
                    }
                    else {
                        console.error(err);
                        addNotification("Erro ao atualizar a quantidade do produto.", true);
                    }
                }
            }

        }
    };

    const addStockQuantity = async (event: React.FormEvent) => {
        event.preventDefault();

        if (stockType === "ingredient") {
            if (ingredientId) {
                try {
                    await api.put(`/stock/add/${bakeryId}/${ingredientId}`, quantity,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    openForm(false);

                } catch (err: any) {
                    if(err.response) {
                        console.error(err.response.data);
                        addNotification(err.response.data, true);
                    }
                    else {
                        console.error(err);
                        addNotification("Erro ao adicionar quantidade do ingrediente.", true);
                    }
                }
            }

        } else if (stockType === "product") {

            if (productId) {
                try {
                    await api.put(`/product-stock/add-stock/${bakeryId}/${productId}`, quantity,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    openForm(false);

                } catch (err: any) {
                    if(err.response) {
                        console.error(err.response.data);
                        addNotification(err.response.data, true);
                    }
                    else {
                        console.error(err);
                        addNotification("Erro ao adicionar quantidade do produto.", true);
                    }
                }
            }

        }
        
    };

    return (
        <>
            <div className="back-modal" onClick={() => openForm(false)}>
                
                <div className="quantity-form" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="close-bot" onClick={() => openForm(false)}><RxCross2 /></button>

                    {mode === "update-cart" && (<h3>Insira a quantidade pretendida</h3>)}
                    {mode === "add-stock" && (<h3>Insira a quantidade a adicionar</h3>)}
                    {mode === "update-stock" && (<h3>Insira a nova quantidade</h3>)}

                    <form className="form-body" onSubmit={mode === "update-cart" ? (
                        updateCartQuantity
                    ) : (
                        mode === "add-stock" ? (
                            addStockQuantity
                        ) : (
                            updateStockQuantity
                        )
                    )}>
                        <input
                            type="number"
                            min="0.0"
                            step="any"
                            required
                            className="quantity-input"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button type="submit" className="submit"><FaCheck /></button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateProductQuantityForm