import { useState } from "react";
import type { recipeDTO } from "../dto/recipeDTO"
import type { recipeIngredientDTO } from "../dto/recipeIngredientDTO";
import RecipeStartForm from "./RecipeStartForm";
import { useSelectedBakery } from "../hooks/hookSelectBakery";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
    recipeSelected: recipeDTO
}

const RecipeSelect: React.FC<Props> = ({recipeSelected}) => {

    const bakery = useSelectedBakery();

    const getQuantity = (ingredient: recipeIngredientDTO) => {
        if (ingredient.unitSymbol === "unid.") {
            return ingredient.quantity
        } else {
            return ingredient.quantity.toFixed(3).replace(".", ",")
        }
    }

    const [startRecipeFormOpen, setstartRecipeFormOpen] = useState<boolean>(false);

    return (
        <>
            <div className="inline-header">
                <h3 className="title-recipe">Receita - {recipeSelected.productName}</h3>
                <button onClick={() => setstartRecipeFormOpen(true)}>Iniciar Receita</button>
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
                                <b>{getQuantity(ingredient)} {ingredient.unitSymbol}</b> de <b>{ingredient.name}</b>
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
                <RecipeStartForm bakeryId={bakery?.id} recipeId={recipeSelected.id} onSwitch={(m) => setstartRecipeFormOpen(m)} />
            )}
        </>
    )
}

export default RecipeSelect