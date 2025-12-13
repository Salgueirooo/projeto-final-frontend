import { useEffect, useState } from "react"
import "../styles/ProductSearch.css"
import ProductSelect from "./ProductSelect";
import type { productDTO } from "../dto/productDTO";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import type { CategoryDTO } from "../dto/categoryDTO";
import { FaArrowCircleLeft } from "react-icons/fa";

type opMode = "selectCategory" | "selectProduct";

interface ProductSearchInt {
    category: CategoryDTO,
    onSwitchMode: (mode: opMode) => void;
}

const ProductSearchByCategory: React.FC<ProductSearchInt> = ({category, onSwitchMode}) => {

    const [productName, setProductName] = useState<string>("");
    
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
    const [products, setProducts] = useState<productDTO[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<productDTO[]>([]);

    const { addToastNotification: addNotification } = useToastNotification();

    useEffect (() => {
        const getProductsByNameAndCategory = async (categoryId: number) => {
            try {
                setLoadingProducts(true);
                const response = await api.get("/product/search-active", {
                    params: { categoryId }
                });
                setProducts(response.data);
                
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } finally {
                setLoadingProducts(false);
            }
        };

        getProductsByNameAndCategory(category.id);
    }, []);

    useEffect(() => {
        const name = productName.trim().toLowerCase();

        if (name === "") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(
                products.filter(r =>
                    r.name.toLowerCase().includes(name)
                )
            );
        }
    }, [productName, products]);

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

                </div>
            </div>
            <div className="product-container">
                {loadingProducts ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        {filteredProducts.length === 0 ? (
                            <h3>Nenhum produto encontrado.</h3>
                        ) : (
                            filteredProducts.map((product) => (
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