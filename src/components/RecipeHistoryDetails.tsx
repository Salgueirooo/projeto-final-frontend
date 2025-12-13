import { useNavigate, useParams } from "react-router-dom";
import type { producedRecipeDTO } from "../dto/producedRecipeDTO"
import { HomeTab } from "../hooks/HomeTab";


interface Props {
    recipeInfo: producedRecipeDTO
}

const RecipeHistoryDetails: React.FC<Props> = ({recipeInfo}) => {
    
    const { bakeryId } = useParams<{ bakeryId: string}>();
    const navigate = useNavigate();

    return (
        <div className="recipeinfo-container">
            <h3 title={recipeInfo.productName}><b>{recipeInfo.dose.toString().replace(".", ",")} dose(s) de {recipeInfo.productName}</b></h3>
            <h4 className="username">Criada por: {recipeInfo.userName}</h4>
            <div className="inline">
                <h4>Iniciada às <b>{recipeInfo.initialDate.toString().substring(11, 16)}</b></h4>
                <h4><b>|</b></h4>
                {recipeInfo.finalDate ? (
                    <h4>Finalizada às <b>{recipeInfo.finalDate.toString().substring(11, 16)}</b></h4> 
                ) : (
                    <button onClick={() => navigate(`/home/${bakeryId}/${HomeTab.StartedRecipes}?recipe=${recipeInfo.id}`)}>A decorrer</button>
                )}
                
            </div>
            
            
        </div>
    )
}

export default RecipeHistoryDetails