import { useEffect, useState } from "react";
import type { activatedRecipeDTO } from "../dto/activatedRecipeDTO";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { FaCheck } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { HomeTab } from "../hooks/HomeTab";
import FinishRecipe from "./RecipeFinish";
import { IoMenu } from "react-icons/io5";
import "../styles/RecipesShow.css"

interface Props {
    selectedRecipeId: number,
    setTradeRecipe: (trade: boolean) => void,
    tradeRecipe: boolean,
    openMain: (open: boolean) => void
}

const RecipeActiveSelect: React.FC<Props> = ({selectedRecipeId, setTradeRecipe, tradeRecipe, openMain}) => {

    const navigate = useNavigate();
    const { bakeryId } = useParams<{ bakeryId: string}>();
    const [recipe, setRecipe] = useState<activatedRecipeDTO>()
    const [loadingRecipe, setLoadingRecipe] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [modalFinish, setModalFinish] = useState(false);

    const refreshRecipe = () => {
        setReload(prev => !prev);
    };

    const location = useLocation();
    const { messages } = useWebSocket();
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const fullPath = location.pathname + location.search;
        
        if (lastMessage.path?.some(p => p === fullPath)) {
            refreshRecipe();
        }
    }, [messages]);

    const { addToastNotification: addNotification } = useToastNotification();

    useEffect (() => {
        const getRecipe = async () => {
            try {
                tradeRecipe && setLoadingRecipe(true);
                const response = await api.get(`/produced-recipe/get-active/${selectedRecipeId}`);
                
                setRecipe(response.data);
                    
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
                tradeRecipe && setLoadingRecipe(false);
                setTradeRecipe(false);
            }
        };

        if (selectedRecipeId) {
            getRecipe();
        }
    }, [selectedRecipeId, reload]);

    const toggleIngredientState = async (id: number) => {
        
        setRecipe(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                ingredientsList: prev.ingredientsList.map(ingredient =>
                    ingredient.id === id
                        ? { ...ingredient, done: !ingredient.done }
                        : ingredient
                ),
            };
        });
        
        try {
               
            await api.put(`/produced-recipe/toggle-ingredient-state/${id}`);
                
        } catch (err: any) {
            setRecipe(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    ingredientsList: prev.ingredientsList.map(ingredient =>
                        ingredient.id === id
                            ? { ...ingredient, done: !ingredient.done }
                            : ingredient
                    ),
                };
            });

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

    const cancelRecipe = async () => {
        try {
            await api.delete(`/produced-recipe/cancel-production/${recipe?.id}`);
            navigate(`/home/${bakeryId}/${HomeTab.StartedRecipes}`);
     
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

    const finishRecipe = async () => {
        if (recipe?.ingredientsList.every(i => i.done === true) ?? false) {

            setModalFinish(true);

        } else {
            addNotification("Atenção! Não foram adicionados todos os ingredientes à receita.", true);
        }
        
    }

    return (
        <>
            {loadingRecipe ? (
                <div className="spinner"></div>
            ) : (
                <>
                    <div className="inline-header">
                        <button className="main-recipes" onClick={() => openMain(true)}><IoMenu /></button>
                        <h3 className="title-recipe-short">Receita de {recipe?.dose.toString().replace(".", ",")} dose(s) de {recipe?.productName} (~{recipe?.nResultingProducts} un.)</h3>
                        <h3 className="title-recipe-short2">{recipe?.productName} - {recipe?.dose.toString().replace(".", ",")} dose(s) </h3>
                        <div className="button-box-recipe">
                            <button className="cancel" onClick={() => cancelRecipe()}>Cancelar</button>
                            <button onClick={() => finishRecipe()}>Terminar</button>
                        </div>
                        
                    </div>
                    
                    <div className="inline">
                        <div className="image">
                            <img src={recipe?.productImage} alt="imagem" />
                        </div>
                        <div className="ingredients">
                            <h3 className="title-ingred">Ingredientes</h3>
                            <div className="ingredient-list">
                                {recipe?.ingredientsList.map((ingredient) =>(

                                    <label key={ingredient.id} className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={ingredient.done}
                                            onChange={() => toggleIngredientState(ingredient.id)}
                                        />
                                        <span className="checkmark">
                                            {ingredient.done ? <FaCheck /> : null} 
                                        </span>
                                        <span className="ingredient-line">{ingredient.quantity.toString().replace(".", ",")} {ingredient.unitSymbol} de {ingredient.name}</span>
                                    </label>
                                    
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="prep-short">
                        <h3 className="title-ingred">Preparação</h3>
                        <div className="prep-text">{recipe?.preparation}</div>
                    </div>
                    <h4>Iniciada por {recipe?.userName} em {recipe?.initialDate.toString().slice(0, 10)} às {recipe?.initialDate.toString().slice(11, 16)}</h4>
                    {modalFinish && <FinishRecipe recipeId={recipe?.id} bakeryId={bakeryId} nResultingProducts={recipe?.nResultingProducts} onSwitch={(m) => setModalFinish(m)} />}
                </>
                
            )}
            
        </>
    )
}

export default RecipeActiveSelect