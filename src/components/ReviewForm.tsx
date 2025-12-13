import { RxCross2 } from "react-icons/rx";
import "../styles/ReviewForm.css"
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";

interface Props {
    onSwitch: (modalOpen: boolean) => void;
    orderDetailsId: number | null;
}

const ReviewForm: React.FC<Props> = ({onSwitch, orderDetailsId}) => {

    const { addToastNotification: addNotification } = useToastNotification();

    const addReview = async () => {
        if (orderDetailsId !== null) {
            try {
                await api.post(`/product-review/add`, {
                    orderDetailsId,
                    rating,
                    review: commentary
                });
                addNotification("Comentário submetido.", false);
                onSwitch(false);
            
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
        }
    };

    const [rating, setRating] = useState<number>(5);
    const [commentary, setCommentary] = useState<string>("");

    const increaseRating = () => {
        if(rating < 5) {
            setRating(rating + 1);
        }
    }

    const decreaseRating = () => {
        if(rating > 1) {
            setRating(rating - 1);
        }
    }

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} className="star full" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} className="star half" />);
            } else {
                stars.push(<FaRegStar key={i} className="star empty" />);
            }
        }
        return stars;
    };

    return (
        <div className="back-modal" onClick={() => onSwitch(false)}>
                                        
            <div className="review-form" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onSwitch(false)}><RxCross2 /></button>
                <div className="body-review">
                    <h2>Classificação</h2>
                    <div className="inline-review">
                        <button onClick={() => decreaseRating()}><FaMinus /></button>
                        <h2>{rating.toFixed(1)}</h2>
                        <h2 className="stars">{renderStars(rating)}</h2>
                        <button onClick={() => increaseRating()}><FaPlus /></button>
                        
                    </div>
                    <h2 className="commentary-review">Comentário (Opcional)</h2>
                    <div className="inline-review">
                        <textarea
                            placeholder="Escreva aqui as notas da sua encomenda..."
                            className="notes-box"
                            value={commentary}
                            onChange={(e) => setCommentary(e.target.value)}>
                        </textarea>
                        
                    </div>
                    <button className="submit" onClick={() => addReview()}>Submeter</button>
                </div>
                
            </div>
        </div>
    )
}

export default ReviewForm