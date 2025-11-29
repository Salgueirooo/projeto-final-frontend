import { FaArrowCircleRight } from "react-icons/fa"
import "../styles/RecipesShow.css"
import { act, useEffect, useState } from "react";
import { useSelectedBakery } from "../hooks/hookSelectBakery";
import { useNotification } from "../context/NotificationContext";
import api from "../services/api";
import type { recipeDTO } from "../dto/recipeDTO";
import SelectBakery from "./BakerySelect";
import type { recipeIngredientDTO } from "../dto/recipeIngredientDTO";
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import RecipeSelect from "./RecipeSelect";
import RecipeStartForm from "./RecipeStartForm";


const ShowRecipes: React.FC = () => {

    const [loadingRecipe, setLoadingRecipe] = useState<boolean>(false);

    
    const {addNotification} = useNotification();

    const [recipes, setRecipes] = useState<recipeDTO[]>([]);
    const [productName, setProductName] = useState<string>("");
    
    const [recipeSelected, setRecipeSelected] = useState<recipeDTO>();

    const [reload, setReload] = useState(false);
    const [searched, setSearched] = useState(false);

    const refreshRecipe = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getRecipe = async () => {
            try {
                setLoadingRecipe(true);
                
                const active = true;
                const response = await api.get(`/recipe/search`,
                    {params: {active, productName}});
                
                    setRecipes(response.data);
                    
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
                    {searched ? (
                        <button onClick={() => {setProductName(""); refreshRecipe(); setSearched(false)}}><RxCross1 /></button>
                    ) : (
                        <button disabled={productName === ""} onClick={() => {refreshRecipe();setSearched(true);}}><IoSearch /></button>
                    )}
                    
                </div>

                {recipes.map((recipe) => (
                    <button className={recipe.id === recipeSelected?.id ? "selected" : "no-selected"} key={recipe.id} onClick={() => setRecipeSelected(recipe)}>
                        <span className="text">{recipe.productName}</span>
                        <FaArrowCircleRight />
                    </button>
                ))}

            </div>
            <div className="body-recipes">
                <div className="recipe-details">
                    {recipeSelected == undefined ? (
                        <h3>Selecione um produto para ver a sua receita</h3>
                    ) : (
                        <RecipeSelect recipeSelected={recipeSelected}/>
                        
                    )}
                </div>
            </div>
            
        </div>
    )
}

export default ShowRecipes