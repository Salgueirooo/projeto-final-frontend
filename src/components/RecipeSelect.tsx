import { useState } from "react";
import type { recipeDTO } from "../dto/recipeDTO"
import RecipeStartForm from "./RecipeStartForm";
import RecipeStatus from "./RecipeStart";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
    recipeSelected: recipeDTO
}

const RecipeSelect: React.FC<Props> = ({recipeSelected}) => {

    const [startRecipeFormOpen, setStartRecipeFormOpen] = useState<boolean>(false);

    return (
        <>
            <div className="inline-header">
                <h3 className="title-recipe">Receita de {recipeSelected.productName} (~{recipeSelected.nResultingProducts} un.)</h3>
                <button onClick={() => setStartRecipeFormOpen(true)}>Iniciar Receita</button>
            </div>
            
            <div className="inline">
                <div className="image">
                    <img src={`${BASE_URL}${recipeSelected.image}`} alt="imagem" />
                </div>
                <div className="ingredients">
                    <h3 className="title-ingred">Ingredientes</h3>
                    <ul>
                        {recipeSelected.ingredients.map((ingredient) =>(
                            <li key={ingredient.id}>
                                {ingredient.quantity.toString().replace(".", ",")} {ingredient.unitSymbol} de {ingredient.name}
                            </li>   
                        ))}
                    </ul>
                </div>

            </div>
            <div className="preparation">
                <h3 className="title-ingred">Preparação</h3>
                <div className="prep-text">{recipeSelected.preparation}</div>
            </div>
            {startRecipeFormOpen && (
                <RecipeStatus recipeId={recipeSelected.id} onSwitch={m => setStartRecipeFormOpen(m)} />
            )}
        </>
    )
}

export default RecipeSelect