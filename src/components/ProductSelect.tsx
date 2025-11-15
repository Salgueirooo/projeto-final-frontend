import { FaInfoCircle } from "react-icons/fa";
import type { productDTO } from "../dto/productDTO";
import "../styles/ProductSelect.css"
import { MdAddShoppingCart, MdOutlineAddShoppingCart } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
import type { bakeryDTO } from "../dto/bakeryDTO";
import { useEffect, useState } from "react";
import ProductInfo from "./ProductInfo";
import { useSelectedBakery } from "../hooks/hookSelectBakery";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ProductInfoInterface {
    product: productDTO
}

const ProductSelect: React.FC<ProductInfoInterface> = ({product}) => {

    const { addNotification } = useNotification();

    const addCart = async (bakeryId: number, productId: number) => {
        try {
            await api.post("/order/add-product", {
                bakeryId: bakeryId,
                productId: productId
            });
            addNotification("O produto foi adicionado ao carrinho.", false);
       
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

    const bakery = useSelectedBakery();

    const finalPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);

    const [modalInfo, setModalInfo] = useState<boolean>(false);

    return (
        <>
            <div className="show-product" >
                {product.discount > 0 && (
                   <div className="discount">-{product.discount}%</div> 
                )}
                
                <div className={product.discount > 0 ? "product-info" : "product-info-small"}>
                    <img src={`${BASE_URL}${product.image}`} alt="imagem" />
                    <h3 title={product.name}>{product.name}</h3>
                    <div className="bots">
                        <div className="prices">
                            {product.discount === 0 ? (
                                <h3 className="no-discount">€{product.price.toFixed(2)}</h3> 
                            ): (
                                <>
                                    <h4><s>€{product.price.toFixed(2)}</s></h4>
                                    <h3>€{finalPrice}</h3>
                                </>
                            )}
                            
                        </div>
                        <button className="info" onClick={() => setModalInfo(true)}>
                            <FaInfoCircle />&nbsp;Informação
                        </button>
                        
                        
                    </div>
                    <button className="buy" onClick={() => bakery && addCart(bakery.id, product.id)}>
                        <FaCirclePlus />&nbsp;&nbsp;Adicionar ao Carrinho
                    </button>
                </div>
                
                
                
                
            </div>
            {modalInfo && (
                <ProductInfo product={product} onSwitch={(b) => setModalInfo(b)}/>
            )}
        </>
    )
}

export default ProductSelect