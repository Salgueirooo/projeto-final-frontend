import { useEffect, useState } from "react"
import "../styles/CategorySearch.css"
import type { CategoryDTO } from "../dto/categoryDTO";
import CategorySelect from "./CategorySelect";
import { useToastNotification } from "../context/NotificationContext";
import api from "../services/api";
import ProductSearchByCategory from "./ProductSearchByCategory";

type opMode = "selectCategory" | "selectProduct";

const CategorySearch: React.FC = () => {

    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const {addToastNotification: addNotification} = useToastNotification();

    useEffect (() => {
        const getCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await api.get("/category/all");
                setCategories(response.data);
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } finally {
                setLoadingCategories(false);
            }
        };

        getCategories();
    }, []);

    const [mode, setMode] = useState<opMode>("selectCategory");
    const [category, setCategory] = useState<CategoryDTO>();

    return (
        <>
            {mode === "selectCategory" ? (
                <>
                    <div className="title">
                        <h2>Selecione uma Categoria.</h2>
                    </div>
                    
                    <div className="category-container">
                        
                        {loadingCategories ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                {categories.length === 0 ? (
                                    <h3>Nenhuma categoria encontrada.</h3>
                                ) : (
                                    categories.map((category) => (
                                        <CategorySelect key={category.id}
                                            onSwitchMode={(m) => setMode(m)}
                                            onSwitchCategory={(category) => setCategory(category)}
                                            category={category} />
                                    ))
                                )} 
                            </>
                        )}
                        
                    </div>
                </>
            ) : (
                category && (
                    <ProductSearchByCategory category={category} onSwitchMode={(m) => setMode(m)}/>
                )
            )}
        </>
    )
}

export default CategorySearch