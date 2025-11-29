import { RxCross2 } from "react-icons/rx";
import type { productDTO } from "../dto/productDTO"
import "../styles/ProductInfo.css"
import { useState } from "react";
import api from "../services/api";
import type { ProductReviewDTO } from "../dto/productReviewDTO";
import { useNotification } from "../context/NotificationContext";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ProductInfoInt {
    product: productDTO,
    onSwitch: (modalInfo: boolean) => void;
}

const ProductInfo: React.FC<ProductInfoInt> = ({product, onSwitch}) => {

    const { addNotification } = useNotification();
    const finalPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);

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

    const [commentsTab, setCommentsTab] = useState<boolean>(false);
    const [loadingComments, setLoadingComments] = useState<boolean>(false);
    const [comments, setComments] = useState<ProductReviewDTO[]>([]);

    const getComments = async (productId: number) => {
        try {
            setLoadingComments(true);
            const response = await api.get(`/product-review/get/${productId}`);
            setComments(response.data);
        
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
            setLoadingComments(false);
        }
    }
    
    return (
        <>
            <div className="back-modal" onClick={() => onSwitch(false)}>
                            
                <div className="product" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onSwitch(false)}><RxCross2 /></button>

                    <div className="firstLine">
                        <img src={`${BASE_URL}${product.image}`} alt="Logotipo" />
                        <div className="container">
                            <h3 className="name" title={product.name}>{product.name}</h3>
                            
                            {product.discount > 0 && (
                                <h4><s className="no-discount">
                                    €{product.price.toFixed(2)}</s>&nbsp;-{product.discount}%
                                </h4>
                            )}
                            
                            <h3>€{finalPrice.replace(".", ",")}</h3>
                        </div>
                    </div>
                    <div className="lastLine">
                        
                        <h4><b>Categoria:</b>&nbsp;{product.categoryName}</h4>
                        {product.description !== null && (
                            <h4 className="description"><b>Descrição:</b>&nbsp;{product.description}</h4>
                        )}

                        <h4 className="rating">
                            <b>Classificação:</b>{product.rating.toFixed(1)}
                            <div className="stars">{renderStars(product.rating)}</div>
                            {product.rating === 0 ? "Sem comentários" : (
                                <button onClick={() => {
                                        const next = !commentsTab;
                                        setCommentsTab(next);
                                        if (next) {
                                            getComments(product.id);    
                                        }
                                    }}>
                                    {commentsTab ? "fechar comentários" : "abrir comentários"}
                                </button>
                            )}
                        </h4>
                        
                        {commentsTab && (
                            <div className="comments">
                                <h4><b>Comentários</b></h4>

                                {loadingComments ? (
                                    <div className="spinner"></div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="comments-container">
                                            <h4>{renderStars(comment.rating)}</h4>
                                            {comment.review !== null && (
                                                <h4>{comment.review}</h4>
                                            )}
                                            <h5>{comment.userName} - {comment.dateTime}</h5>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductInfo