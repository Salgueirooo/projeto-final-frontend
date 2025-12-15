import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import RecipeStartForm from "./RecipeStartForm";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useParams } from "react-router-dom";
import type { ingredientStockCheckDTO } from "../dto/ingredientStockCheckDTO";
import "../styles/RecipeStartForm.css"
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

interface Props {
    recipeId: number;
    onSwitch: (modalForm: boolean) => void;
}

type mode = "recipeStockStatus" | "startRecipe"

const RecipeStatus: React.FC<Props> = ({recipeId, onSwitch}) => {

    const [mode, setMode] = useState<mode>("recipeStockStatus")
    const [loadingStock, setLoadingStock] = useState<boolean>(false);
    const [recipeStocks, setRecipeStocks] = useState<ingredientStockCheckDTO[]>([]);
    const {addToastNotification: addNotification} = useToastNotification();

    const { bakeryId } = useParams<string>();

    useEffect (() => {
        const getStocks = async () => {
            try {
                setLoadingStock(true);
                const response = await api.get(`/stock/recipe-stock-status/${bakeryId}/${recipeId}`);
                setRecipeStocks(response.data);
                
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } finally {
                setLoadingStock(false);
            }
        };

        getStocks();
    }, []);

    return (
        <>
            {mode === "recipeStockStatus" ? (
                <div className="back-modal" onClick={() => onSwitch(false)}>
                    <div className="recipe-start" onClick={(e) => e.stopPropagation()}>
                        <button className="close-bot" onClick={() => onSwitch(false)}><RxCross2 /></button>
                        
                        <table>
                            <thead>
                                <tr>
                                    <th className="name">Ingrediente</th>
                                    <th className="quantity-stock">Quantidade</th>
                                    <th className="sufficient">Suficiente</th>
                                </tr>
                            </thead>                  
                        </table>
        
                        <div className="table-body-status">
                            <table className="cart-table">
                                <tbody>
        
                                    {loadingStock ? (
                                        <tr>
                                            <td><div className="spinner"></div></td>
                                        </tr>
                                        
                                    ) : (
                                        <>
                                            {recipeStocks.map(recipeStock => (
                                                    <tr key={recipeStock.ingredient.id}>
                                                        <td className="name" title={recipeStock.ingredient.name}>{recipeStock.ingredient.name}</td>
                                                        <td className="quantity-stock">{recipeStock.ingredient.quantity.toString().replace(".", ",")} / {recipeStock.availableQuantity.toString().replace(".", ",")} {recipeStock.ingredient.unitSymbol}</td>
                                                        <td className={recipeStock.sufficient ? "sufficient" : "insufficient"}>{recipeStock.sufficient ? (<FaCheck />) : (<ImCross />)}</td>
                                                    </tr>
                                            ))} 
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {recipeStocks.every(recipeStock => recipeStock.sufficient !== false) ? (
                            <button className="start-recipe" onClick={() => setMode("startRecipe")}>Iniciar Receita</button>
                        ) : (
                            <button className="start-recipe" onClick={() => onSwitch(false)}>Cancelar</button>
                        )}
                        
                    </div>
                </div>  
            ) : (
                <RecipeStartForm recipeId={recipeId} onSwitch={onSwitch}/>
            )}
        </>



        
        
    )
}

export default RecipeStatus