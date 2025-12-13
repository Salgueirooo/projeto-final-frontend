import { RxCross2 } from "react-icons/rx";
import "../styles/UpdateProductQuantityForm.css"
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";

interface Props {
    openForm: (op: boolean) => void;
    refreshOrder: () => void;
    orderDetailsId: number;
}

const UpdateProductQuantityForm: React.FC<Props> = ({refreshOrder, openForm, orderDetailsId}) => {

    const [quantity, setQuantity] = useState<number>(1)
    const {addToastNotification: addNotification} = useToastNotification();
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await api.put("/order/upgrade-product", {orderDetailsId, quantity});

            addNotification("A quantidade do produto foi atualizada.", false);
            openForm(false);
            refreshOrder();

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
    };

    return (
        <>
            <div className="back-modal" onClick={() => openForm(false)}>
                <div className="quantity-form" onClick={(e) => e.stopPropagation()}>
                    <button className="close-bot" onClick={() => openForm(false)}><RxCross2 /></button>

                    <h3>Insira a quantidade pretendida</h3>
                    <form className="form-body" onSubmit={handleSubmit}>
                        <input
                            type="number"
                            min="0"
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