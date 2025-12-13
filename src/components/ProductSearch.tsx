import { useEffect, useState } from "react"
import "../styles/ProductSearch.css"
import { IoSearch } from "react-icons/io5";
import ProductSelect from "./ProductSelect";
import type { productDTO } from "../dto/productDTO";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { HomeTab } from "../hooks/HomeTab";

const ProductSearch: React.FC = () => {

    const navigate = useNavigate();
    const { bakeryId } = useParams<string>();
    const [params] = useSearchParams();

    const initialProductName = params.get("product-name") ?? "";

    const [productName, setProductName] = useState<string>(initialProductName);
    
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
    const [products, setProducts] = useState<productDTO[]>([]);

    const { addToastNotification: addNotification } = useToastNotification();

    const [searched, setSearched] = useState<boolean>(false);

    const [reload, setReload] = useState(false);
    
    const refreshOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/home/${bakeryId}/${HomeTab.SearchProducts}?product-name=${productName}`);
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getProductsByName = async (name: string) => {
            try {
                setLoadingProducts(true);
                setSearched(true);
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

        if (productName.length > 0)
            getProductsByName(productName);
    }, [reload]);

    return (
        <>
            <div className="space-search-bar">
                <form className="search-box" onSubmit={refreshOrder}>
                    <input className="search-text"
                        type="text"
                        id="name"
                        placeholder='O que procura?'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={productName.trim().length === 0}>
                        <IoSearch /></button>
                </form>
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