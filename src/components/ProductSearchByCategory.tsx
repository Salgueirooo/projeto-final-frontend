import { useEffect, useState } from "react"
import "../styles/ProductSearch.css"
import { IoSearch } from "react-icons/io5";
import ProductSelect from "./ProductSelect";
import type { productDTO } from "../dto/productDTO";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
import type { CategoryDTO } from "../dto/categoryDTO";
import { FaArrowCircleLeft } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

type opMode = "selectCategory" | "selectProduct";

interface ProductSearchInt {
    category: CategoryDTO,
    onSwitchMode: (mode: opMode) => void;
}

const ProductSearchByCategory: React.FC<ProductSearchInt> = ({category, onSwitchMode}) => {

    const [productName, setProductName] = useState<string>("");
    
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
    const [products, setProducts] = useState<productDTO[]>([]);

    const { addNotification } = useNotification();

    const getProductsByNameAndCategory = async (name: string | null, categoryId: number) => {
        try {
            setLoadingProducts(true);
            const response = await api.get("/product/search-active", {
                params: { name, categoryId }
            });
            setProducts(response.data);
            
        } catch (err) {
            console.error(err);
            addNotification("Erro na comunicação com o Servidor.", true);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect (() => {
        getProductsByNameAndCategory(null, category.id);
    }, []);

    const [searched, setSearched] = useState<boolean>(false);

    const cleanSearch = () => {
        setProductName("");
        getProductsByNameAndCategory(null, category.id);
        setSearched(false);
    }

    return (
        <>
            <div className="space-search-bar-category">
                <div className="go-back" onClick={() => onSwitchMode("selectCategory")}>
                    <FaArrowCircleLeft />&nbsp;&nbsp;<span>{category.name}</span>
                </div>
                
                <div className="search-box">
                    
                    <input className="search-text"
                        type="text"
                        id="name"
                        placeholder='O que procura nesta categoria?'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    
                    {searched ? (
                        <button onClick={() => cleanSearch()}>
                            <RxCross1 />
                        </button>
                    ) : (
                        <button disabled={productName === ""} onClick={() => {
                                getProductsByNameAndCategory(productName, category.id);
                                setSearched(true);
                            }}>
                            <IoSearch />
                        </button>
                    )}

                    
                </div>
            </div>
            <div className="product-container">
                {loadingProducts ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        {products.length === 0 ? (
                            <h3>Nenhum produto encontrado.</h3>
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

export default ProductSearchByCategory