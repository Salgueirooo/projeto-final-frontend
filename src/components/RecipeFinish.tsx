import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import "../styles/RecipeFinish.css"
import { HomeTab } from "../hooks/HomeTab";

interface Props {
    recipeId?: number;
    bakeryId?: string;
    nResultingProducts?: number;
    onSwitch: (modalForm: boolean) => void;
}


const FinishRecipe: React.FC<Props> = ({recipeId, bakeryId, nResultingProducts: nResultingProductsInitial, onSwitch}) => {

    const { addToastNotification: addNotification } = useToastNotification();
    const navigate = useNavigate();
    const [loadingBot, setLoadingBot] = useState(false);
    const [nResultingProducts, setNResultingProducts] = useState(String(nResultingProductsInitial));

    const finishRecipe = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoadingBot(true);
            await api.put(`/produced-recipe/complete-production/${recipeId}`, Number(nResultingProducts),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            onSwitch(false);
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
        } finally {
            setLoadingBot(false);
        }
        
        
    }

    return (
        <div className="back-modal" onClick={() => onSwitch(false)}>
            <div className="recipe-finish" onClick={(e) => e.stopPropagation()}>
                <button className="close-bot" onClick={() => onSwitch(false)}><RxCross2 /></button>
                
                <form onSubmit={finishRecipe} className="finish">
                    <h2>Indique o número de produtos produzidos com esta receita</h2>
                    <input
                        type="number"
                        id="n"
                        min={0}
                        value={nResultingProducts}
                        onChange={(e) => setNResultingProducts(e.target.value)}
                        required
                    />
                    <button type="submit">{loadingBot ? (<div className="spinner"></div>) : (<>Terminar Receita</>)}</button>
                </form>
                
                
                
                
            </div>
        </div>  
    )
}

export default FinishRecipe