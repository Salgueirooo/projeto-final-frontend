import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import RecipeStartForm from "./RecipeStartForm";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useParams } from "react-router-dom";
import type { IngredientStockCheckDTO } from "../dto/ingredientStockCheckDTO";
import "../styles/RecipeStartForm.css"
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

interface Props {
    recipeId: number;
    onSwitch: (modalForm: boolean) => void;
}

type mode = "recipeStockStatus" | "chooseDose"

const RecipeStatus: React.FC<Props> = ({recipeId, onSwitch}) => {

    const [mode, setMode] = useState<mode>("chooseDose");
    const [loadingStock, setLoadingStock] = useState<boolean>(false);
    const [recipeStocks, setRecipeStocks] = useState<IngredientStockCheckDTO[]>([]);
    const {addToastNotification: addNotification} = useToastNotification();

    const { bakeryId } = useParams<string>();
    const [dose, setDose] = useState(0);

    useEffect (() => {
        const getStocks = async () => {
            if (dose > 0) {
                try {
                    setLoadingStock(true);
                    const response = await api.get(`/stock/recipe-stock-status/${bakeryId}/${recipeId}`,
                        {params: {dose}}
                    );
                    setRecipeStocks(response.data);
                    
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
                    setLoadingStock(false);
                }
            }
        };

        getStocks();
    }, [dose]);

    const addProducedRecipe = async () => {
          
        if (dose > 0) {
            try {
            
                await api.post("/produced-recipe/add", {
                    recipeId,
                    bakeryId,
                    dose
                });

            } catch (err: any) {

                if (err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                } else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);
                }
            }
        }
    };

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
                                                        <td className="quantity-stock">{recipeStock.quantityNeeded.toString().replace(".", ",")} / {recipeStock.availableQuantity.toString().replace(".", ",")} {recipeStock.ingredient.unitSymbol}</td>
                                                        <td className={recipeStock.sufficient ? "sufficient" : "insufficient"}>{recipeStock.sufficient ? (<FaCheck />) : (<ImCross />)}</td>
                                                    </tr>
                                            ))} 
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {recipeStocks.every(recipeStock => recipeStock.sufficient !== false) ? (
                            <button className="start-recipe" onClick={() => {addProducedRecipe(); onSwitch(false);}}>Iniciar Receita</button>
                        ) : (
                            <button className="start-recipe" onClick={() => onSwitch(false)}>Cancelar</button>
                        )}
                        
                    </div>
                </div>  
            ) : (
                <RecipeStartForm onSwitch={onSwitch} setDose={(d) => setDose(d)} setMode={(m) => setMode(m)}/>
            )}
        </>



        
        
    )
}

export default RecipeStatus