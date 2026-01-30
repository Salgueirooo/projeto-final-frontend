import { FaArrowCircleRight } from "react-icons/fa"
import "../styles/RecipesShow.css"
import { useEffect, useState } from "react";
import { useToastNotification } from "../context/NotificationContext";
import api from "../services/api";
import type { recipeDTO } from "../dto/recipeDTO";
import RecipeSelect from "./RecipeSelect";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { HomeTab } from "../hooks/HomeTab";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";


const ShowRecipes: React.FC = () => {

    const navigate = useNavigate();
    const { bakeryId } = useParams<{ bakeryId: string}>();
    const [params] = useSearchParams();

    const [openMain, setOpenMain] = useState(true);

    const [loadingRecipe, setLoadingRecipe] = useState<boolean>(false);

    const {addToastNotification: addNotification} = useToastNotification();

    const [recipes, setRecipes] = useState<recipeDTO[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<recipeDTO[]>([]);
    const [productName, setProductName] = useState<string>("");
    
    const recipeParam = params.get("recipe");
    const initialRecipeId = recipeParam ? Number(recipeParam) : null;

    const recipeSelected = initialRecipeId
        ? recipes.find(r => r.id === initialRecipeId)
        : undefined;
    
    const setSelectedRecipe = (newRecipeId: number) => {
        navigate(`/home/${bakeryId}/${HomeTab.SearchRecipes}?recipe=${newRecipeId}`);
    };

    useEffect(() => {
        const name = productName.trim().toLowerCase();

        if (name === "") {
            setFilteredRecipes(recipes);
        } else {
            setFilteredRecipes(
                recipes.filter(r =>
                    r.productName.toLowerCase().includes(name)
                )
            );
        }
    }, [productName, recipes]);

    useEffect (() => {
        const getRecipe = async () => {
            try {
                setLoadingRecipe(true);
                
                const active = true;
                const response = await api.get(`/recipe/search`,
                    {params: {active}});
                
                    setRecipes(response.data);
                    setFilteredRecipes(response.data);
                    
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
                setLoadingRecipe(false);
            }
        };

        getRecipe();
    }, []);
    
    return (
        <div className="show-recipe">
            <div className="side-bar-recipes">
                <div className="search-recipe">
                    <input className="search-recipe-name"
                        type="text"
                        id="name"
                        value={productName}
                        placeholder="Pesquisar"
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    
                    
                </div>

                {loadingRecipe ? (
                    <div className="spinner"></div>
                ) : (
                    filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <button className={recipe.id === recipeSelected?.id ? "selected" : "no-selected"} key={recipe.id} onClick={() => setSelectedRecipe(recipe.id)}>
                                <span className="text">{recipe.productName}</span>
                                <FaArrowCircleRight />
                            </button>
                        ))
                    ) : (
                        <span className="text">Nenhuma receita encontrada.</span>
                    )
                    
                )}

            </div>
            
            {openMain && (
                <div className="back-side-bar-mobile" onClick={() => setOpenMain(false)}>
                    <div className="side-bar-recipes-mobile" onClick={(e) => e.stopPropagation()}>
                        <div className="search-recipe">
                            <button className="main-recipes" onClick={() => setOpenMain(false)}><RxCross2 /></button>
                            
                            <input className="search-recipe-name"
                                type="text"
                                id="name"
                                value={productName}
                                placeholder="Pesquisar"
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            
                            
                        </div>

                        {loadingRecipe ? (
                            <div className="spinner"></div>
                        ) : (
                            filteredRecipes.length > 0 ? (
                                filteredRecipes.map((recipe) => (
                                    <button className={recipe.id === recipeSelected?.id ? "selected" : "no-selected"} key={recipe.id} onClick={() => {setSelectedRecipe(recipe.id); setOpenMain(false)}}>
                                        <span className="text">{recipe.productName}</span>
                                        <FaArrowCircleRight />
                                    </button>
                                ))
                            ) : (
                                <span className="text">Nenhuma receita encontrada.</span>
                            )
                            
                        )}

                    </div>
                </div>
                
            )}
             

            <div className="body-recipes">
                <div className="recipe-details">
                    {recipeSelected == undefined ? (
                        <>
                            <button className="main-recipes" onClick={() => setOpenMain(true)}><IoMenu />&nbsp;Receitas</button>
                            <h3>Selecione um produto para consultar a sua receita.</h3>
                        </>
                        
                    ) : (
                        <RecipeSelect recipeSelected={recipeSelected} openMain={(m) => setOpenMain(m)}/>
                        
                    )}
                </div>
            </div>
        </div>
    )
}

export default ShowRecipes