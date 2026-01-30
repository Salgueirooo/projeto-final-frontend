import { FaArrowCircleRight } from "react-icons/fa"
import "../styles/RecipesShow.css"
import { useEffect, useState } from "react";
import { useToastNotification } from "../context/NotificationContext";
import api from "../services/api";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { HomeTab } from "../hooks/HomeTab";
import type { producedRecipeDTO } from "../dto/producedRecipeDTO";
import RecipeActiveSelect from "./RecipeActiveDetails";
import { useWebSocket } from "../context/WebSocketContext";
import { IoMenu } from "react-icons/io5";


const ShowActivatedRecipes: React.FC = () => {

    const navigate = useNavigate();
    const { bakeryId } = useParams<{ bakeryId: string}>();
    const [params] = useSearchParams();

    const [loadingRecipe, setLoadingRecipe] = useState<boolean>(false);

    const [openMain, setOpenMain] = useState(true);

    const {addToastNotification: addNotification} = useToastNotification();

    const [recipes, setRecipes] = useState<producedRecipeDTO[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<producedRecipeDTO[]>([]);
    const [productName, setProductName] = useState<string>("");
    
    const [reload, setReload] = useState<boolean>(false);

    const refreshRecipes = () => {
        setReload(prev => !prev);
    };

    const location = useLocation();
    const { messages } = useWebSocket();
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];

        if (lastMessage.path?.some(p => p === location.pathname)) {
            refreshRecipes();
        }
    }, [messages]);

    const recipeParam = params.get("recipe");

    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(
        recipeParam ? Number(recipeParam) : null
    );

    useEffect(() => {
        const p = params.get("recipe");
        setSelectedRecipeId(p ? Number(p) : null);
    }, [params]);

    const recipeSelected = selectedRecipeId
        ? recipes.find(r => r.id === selectedRecipeId)
        : undefined;
    
    const [tradeRecipe, setTradeRecipe] = useState(false);

    const setSelectedRecipe = (newRecipeId: number) => {
        navigate(`/home/${bakeryId}/${HomeTab.StartedRecipes}?recipe=${newRecipeId}`);
        setTradeRecipe(true);
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
        const getRecipes = async () => {
            try {
                setLoadingRecipe(true);
                
                const response = await api.get(`/produced-recipe/get-active-recipes/${bakeryId}`);
                const newRecipes: producedRecipeDTO[] = response.data;
                setRecipes(response.data);
                setFilteredRecipes(response.data);

                if (recipeSelected && newRecipes.every((recipe) => recipe.id !== recipeSelected?.id)) {
                    navigate(`/home/${bakeryId}/${HomeTab.StartedRecipes}`);
                }
                    
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

        getRecipes();
    }, [reload]);
    
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
                                <div className="act-recipe-info">
                                    <h3>{recipe.productName}</h3>
                                    <h4>{recipe.initialDate.toString().replace("T", " ").slice(11, 16)} - {recipe.userName}</h4>
                                </div>
                                
                                
                                <FaArrowCircleRight />
                            </button>
                        ))
                    ) : (
                        <span className="text">Sem receitas em produção.</span>
                    )
                    
                )}

            </div>

            {openMain && (
                <div className="back-side-bar-mobile" onClick={() => setOpenMain(false)}>
                    <div className="side-bar-recipes-mobile">
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
                                        <div className="act-recipe-info">
                                            <h3>{recipe.productName}</h3>
                                            <h4>{recipe.initialDate.toString().replace("T", " ").slice(11, 16)} - {recipe.userName}</h4>
                                        </div>
                                        
                                        
                                        <FaArrowCircleRight />
                                    </button>
                                ))
                            ) : (
                                <span className="text">Sem receitas em produção.</span>
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
                            <h3>Selecione a receita que deseja seguir.</h3>
                        </>
                        
                    ) : (
                        
                        <RecipeActiveSelect selectedRecipeId={recipeSelected.id} setTradeRecipe={(m) => setTradeRecipe(m)} tradeRecipe={tradeRecipe} openMain={(m) => setOpenMain(m)}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ShowActivatedRecipes