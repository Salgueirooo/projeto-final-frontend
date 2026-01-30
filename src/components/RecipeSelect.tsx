import { useState } from "react";
import type { recipeDTO } from "../dto/recipeDTO"
import RecipeStatus from "./RecipeStart";
import { IoMenu } from "react-icons/io5";
import "../styles/RecipesShow.css"

interface Props {
    recipeSelected: recipeDTO,
    openMain: (open: boolean) => void
}

const RecipeSelect: React.FC<Props> = ({recipeSelected, openMain}) => {

    const [startRecipeFormOpen, setStartRecipeFormOpen] = useState<boolean>(false);

    return (
        <>
            <div className="inline-header">
                <button className="main-recipes" onClick={() => openMain(true)}><IoMenu /></button>
                <h3 className="title-recipe">Receita de {recipeSelected.productName} (~{recipeSelected.nResultingProducts} un.)</h3>
                <h3 className="title-recipe2">{recipeSelected.productName} (~{recipeSelected.nResultingProducts} un.)</h3>
                <button onClick={() => setStartRecipeFormOpen(true)}>Iniciar</button>
            </div>
            
            <div className="inline">
                <div className="image">
                    <img src={recipeSelected.image} alt="imagem" />
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