import { useEffect, useState } from "react"
import "../styles/ProductSearch.css"
import { IoSearch } from "react-icons/io5";
import ProductSelect from "./ProductSelect";
import type { productDTO } from "../dto/productDTO";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const ProductSearch: React.FC = () => {

    const [productName, setProductName] = useState<string>("");
    
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
    const [products, setProducts] = useState<productDTO[]>([]);

    const { addNotification } = useNotification();

    const [searched, setSearched] = useState<boolean>(false);

    const getProductsByName = async (name: string) => {
        try {
            setLoadingProducts(true);
            const response = await api.get("/product/search-active", {
                params: { name }
            });
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            addNotification("Erro na comunicação com o Servidor.", true);
        } finally {
            setLoadingProducts(false);
        }
    };

    return (
        <>
            <div className="space-search-bar">
                <div className="search-box">
                    <input className="search-text"
                        type="text"
                        id="name"
                        placeholder='O que procura?'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <button disabled={productName.trim().length === 0} onClick={() => {getProductsByName(productName); setSearched(true)}}>
                        <IoSearch /></button>
                </div>
            </div>
            <div className="product-container">
                {loadingProducts ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        {products.length === 0 ? (

                            !searched ? (
                                <h3>Indique o nome do produto que deseja encontrar.</h3>
                            ) : (
                                <h3>Nenhum produto encontrado.</h3>
                            )
                            
                        ) : (
                            products.map((product) => (
                                <ProductSelect key={product.id} product={product} />
                            ))
                        )} 
                    </>
                    
                )}
            </div>
        </>
    )
}

export default ProductSearch