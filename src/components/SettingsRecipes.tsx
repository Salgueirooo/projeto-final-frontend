import { useEffect, useState } from "react";
import "../styles/Settings.css"
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import type { productDTO } from "../dto/productDTO";
import type { recipeDTO } from "../dto/recipeDTO";
import type { IngredientDTO } from "../dto/ingredientDTO";
import type { recipeIngredientDTO } from "../dto/recipeIngredientDTO";

type mode = "nameAsc" | "nameDesc"
type confIngredient = "normal" | "update" | "add"

const RecipeSettings: React.FC = () => {

    const [showMode, setShowMode] = useState<mode>("nameAsc");
    const { addToastNotification: addNotification } = useToastNotification();

    const [loadingRecipes, setLoadingRecipes] = useState(true);
    const [loadingRecipeIngredients, setLoadingRecipeIngredients] = useState(true);

    const [reload, setReload] = useState(false);
    const [reloadIngredients, setReloadIngredients] = useState(false);
    const [recipes, setRecipes] = useState<recipeDTO[]>([]);
    const [products, setProducts] = useState<productDTO[]>([]);
    const [showRecipes, setShowRecipes] = useState<recipeDTO[]>([]);
    const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
    const [recipeIngredients, setRecipeIngredients] = useState<recipeIngredientDTO[]>([]);

    const [updateModal, setUpdateModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [confIngredientModal, setConfIngredientModal] = useState(false);
    const [confIngredientMode, setConfIngredientMode] = useState<confIngredient>("normal");

    const [recipeSelected, setRecipeSelected] = useState(0); //recipeId
    
    const [productId, setProductId] = useState(0);
    const [preparation, setPreparation] = useState("");
    const [nResultingProducts, setNResultingProducts] = useState(0);
    const [ingredientId, setIngredientId] = useState(0);
    const [quantity, setQuantity] = useState(0.0);
    const [recipeIngredientSelected, setRecipeIngredientSelected] = useState(0);

    const [productToShow, setProductToShow] = useState("");
    const [ingredientToShow, setIngredientToShow] = useState("");
    const [unitToUse, setUnitToUse] = useState("");

    const refreshRecipes = () => {
        setReload(prev => !prev);
    };

    const refreshRecipeIngredients = () => {
        setReloadIngredients(prev => !prev);
    };

    const resetInputValues = () => {
        setRecipeSelected(0);
        setProductId(0);
        setPreparation("");
        setNResultingProducts(0);
        setIngredientId(0);
        setQuantity(0.0);
        setProductToShow("");
        setIngredientToShow("");
        setConfIngredientMode("normal");
        setRecipeIngredients([]);
    }

    const setRecipeValues = (recipe: recipeDTO) => {
        resetInputValues();

        setRecipeSelected(recipe.id);
        setProductId(recipe.productId);
        setPreparation(recipe.preparation);
        setNResultingProducts(recipe.nResultingProducts);

    }

    const setIngredientsValues = (recipeIngredient: recipeIngredientDTO) => {
        setRecipeIngredientSelected(recipeIngredient.id);
        setQuantity(recipeIngredient.quantity);
        setUnitToUse(recipeIngredient.unitSymbol);
    }

    const resetIngredientsValues = () => {
        setRecipeIngredientSelected(0);
        setQuantity(0);
        setUnitToUse("");
    }

    useEffect (() => {
        const setProductInfo = () => {
            if (productToShow.length > 0) {
                const productSelected = products.find(p => p.name === productToShow);

                if (!productSelected) return;

                setProductId(productSelected.id);
            }
        }

        setProductInfo();
    }, [productToShow]);

    useEffect (() => {
        const setIngredientInfo = () => {
            if (ingredients.length > 0 && ingredientToShow.length > 0) {
                const ingredient = ingredients.find(i => i.name === ingredientToShow);

                if (!ingredient) return;

                setIngredientId(ingredient.id);
                setUnitToUse(ingredient.unitSymbol)
            }
        }

        setIngredientInfo();
    }, [ingredientToShow]);

    const addRecipe = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await api.post(`/recipe/add`, 
                {productId, preparation, nResultingProducts}
            );
            refreshRecipes();
            setAddModal(false);
            addNotification("A Receita foi adicionada.", false);
            
        } catch (err:any) {
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

    const updateRecipe = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if(recipeSelected > 0) {
            try {
                await api.put(`/recipe/update/${recipeSelected}`, {preparation, nResultingProducts});
                refreshRecipes();
                setUpdateModal(false);
                addNotification("A Receita foi atualizada.", false);
                
            } catch (err:any) {
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
        
    }

    const deleteRecipe = async (id: number) => {
        if (id > 0) {
            try {
                await api.delete(`/recipe/delete/${id}`);
                refreshRecipes();
                addNotification("A Receita foi eliminada.", false);
                
            } catch (err:any) {
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
    }

    const addRecipeIngredient = async (event: React.FormEvent) => {
        event.preventDefault();

        if (recipeSelected > 0) {
            try {
                await api.post(`/recipe/add-ingredient`, 
                    {recipeId: recipeSelected, ingredientId, quantity}
                );
                refreshRecipeIngredients();
                setConfIngredientMode("normal");
                addNotification("O Ingrediente da Receita foi adicionado.", false);
                
            } catch (err:any) {
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
        
    }

    const updateRecipeIngredient = async (event: React.FormEvent) => {
        event.preventDefault();

        if (recipeIngredientSelected > 0) {
            try {
                await api.put(`/recipe/update-ingredient/${recipeIngredientSelected}`, quantity,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                refreshRecipeIngredients();
                setConfIngredientMode("normal");
                addNotification("O Ingrediente da Receita foi atualizado.", false);
                
            } catch (err:any) {
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
        
    }

    const deleteRecipeIngredient = async (id: number) => {
        if (id > 0) {
            try {
                await api.delete(`/recipe/delete-ingredient/${id}`);
                refreshRecipeIngredients();
                addNotification("O Ingrediente da Receita foi eliminado.", false);
                
            } catch (err:any) {
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
    }

    useEffect (() => {
        const getRecipeIngredients = async () => {
            if (recipeSelected > 0) {
                try {
                    const response = await api.get(`/recipe/${recipeSelected}/ingredients`);
                    setRecipeIngredients(response.data);
                    
                } catch (err:any) {
                    if(err.response) {
                        console.error(err.response.data);
                        addNotification(err.response.data, true);
                    }
                    else {
                        console.error(err);
                        addNotification("Erro na comunicação com o Servidor.", true);

                    }
                } finally {
                    setLoadingRecipeIngredients(false);
                }
            }
        }

        getRecipeIngredients();
    }, [reloadIngredients]);

    useEffect (() => {
        const getRecipes = async () => {
            try {
                const response = await api.get(`/recipe/search`);
                setRecipes(response.data);
                
            } catch (err:any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);

                }
            } finally {
                setLoadingRecipes(false);
            }
        };

        getRecipes();
    }, [reload]);

    useEffect (() => {
        const getProducts = async () => {
            try {
                const response = await api.get(`/product/search`);
                setProducts(response.data);
                
            } catch (err:any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);

                }
            }
        };

        getProducts();
    }, []);

    useEffect (() => {
        const getIngredients = async () => {
            try {
                const response = await api.get(`/ingredient/search`);
                setIngredients(response.data);
                
            } catch (err:any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);

                }
            }
        };

        getIngredients();
    }, []);

    const changeShowMode = () => {
         
        if (showMode === "nameAsc") {
            setShowMode("nameDesc");
        } else {
            setShowMode("nameAsc");
        }
    }

    const sortByNameDesc = (arr: typeof recipes) =>
        [...arr].sort((a, b) =>
            b.productName.localeCompare(a.productName)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowRecipes(recipes);

        } else if (showMode === "nameDesc") {
            setShowRecipes(sortByNameDesc(recipes));

        }

    }, [showMode, recipes]);

    return (
        <>
            <div className="show-setting">
                <div className="header">
                    <h2>Gestão de Receitas</h2>
                    <button onClick={() => { resetInputValues(); setAddModal(true) }}><FaPlus /></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode()}>
                                Receita {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="button-container">
                                Atualizar
                            </th>
                            <th className="button-container">
                                Ingredientes
                            </th>
                            <th className="button-container">
                                Remover
                            </th>
                            
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-settings">
                    <table className="cart-table">
                        <tbody>

                            {loadingRecipes ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showRecipes.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem Receitas para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showRecipes.map(recipe => (
                                            
                                            <tr key={recipe.id}>
                                                <td className="name" title={recipe.productName}>{recipe.productName}</td>
                                                <td className="button-container">
                                                    <button className="edit" onClick={() => {setRecipeValues(recipe); setUpdateModal(true)} }><FaPencilAlt /></button>
                                                </td>
                                                <td className="button-container">
                                                    <button className="edit" onClick={() => {setLoadingRecipeIngredients(true); setRecipeValues(recipe); refreshRecipeIngredients(); setConfIngredientModal(true)} }><FaPencilAlt /></button>
                                                </td>
                                                <td className="button-container">
                                                    <button className="remove" onClick={() => deleteRecipe(recipe.id)}><RxCross1 /></button>
                                                </td>
                                                
                                            </tr>

                                        ))
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {confIngredientModal && (
                <div onClick={() => setConfIngredientModal(false)} className="back-modal">
                    <div onClick={(e) => e.stopPropagation()} className="settings-form" /*onSubmit={updateProduct}*/>
                        <button onClick={() => setConfIngredientModal(false)}><RxCross2 /></button>

                        <div className="inline-title-button">
                            {confIngredientMode === "add" ? 
                                (<button onClick={() => setConfIngredientMode("normal")}><RxCross1 /></button>) : 
                                (<button onClick={() => { setConfIngredientMode("add"); resetIngredientsValues(); }}><FaPlus /></button>)
                            }
                            
                            <h4>Ingredientes</h4>
                        </div>
                        
                        <div className="ingredients-container">

                            {loadingRecipeIngredients ? (
                                <div className="spinner"></div>
                            ) : (
                                recipeIngredients.length === 0 ? (
                                    <div className="ingredient-box">
                                        <h5>Sem ingredientes para mostrar</h5>
                                    </div>
                                ) : (
                                    recipeIngredients.map(recipeIngredient => (
                                        <div className="ingredient-box" key={recipeIngredient.id}>
                                            <h5>{recipeIngredient.quantity}{recipeIngredient.unitSymbol} de {recipeIngredient.name}</h5>
                                            <button onClick={() => { setIngredientsValues(recipeIngredient); setConfIngredientMode("update"); }}><FaPencilAlt /></button>
                                            <button className="remove" onClick={() => deleteRecipeIngredient(recipeIngredient.id)}><RxCross1 /></button>
                                        </div>
                                    ))
                                )
                            )}

                        </div>

                        {confIngredientMode === "add" && (
                            <form onSubmit={addRecipeIngredient}>
                                <h4>Ingrediente (*)</h4>
                                <select
                                    id="ingredient"
                                    value={ingredientToShow}
                                    onChange={(e) => setIngredientToShow(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>
                                        Selecione um Ingrediente...
                                    </option>

                                    {ingredients.map((product) => (
                                        <option key={product.id} value={product.name}>
                                            {product.name}
                                        </option>
                                    ))}


                                </select>

                                <h4>Quantidade{ingredientToShow && `(${unitToUse})`} (*)</h4>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="0.00"
                                    step="any"
                                    placeholder='Insira a quantidade do ingrediente...'
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                />

                                <button type="submit" className="submit">Adicionar Ingrediente</button>
                            </form>
                        )}

                        {confIngredientMode === "update" && (
                            <form onSubmit={updateRecipeIngredient}>
                                <h4>Quantidade{unitToUse && `(${unitToUse})`} (*)</h4>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="0"
                                    step="any"
                                    placeholder='Insira a quantidade do ingrediente...'
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                />

                                <button type="submit" className="submit">Atualizar Ingrediente</button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {updateModal && (
                <div onClick={() => setUpdateModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={updateRecipe}>
                        <button onClick={() => setUpdateModal(false)}><RxCross2 /></button>

                        <h4 className="first">Preparação (*)</h4>
                        <textarea
                            placeholder='Insira a preparação da receita...'
                            className="notes-box"
                            value={preparation}
                            onChange={(e) => setPreparation(e.target.value)}
                            required
                        />

                        <h4>Número de Produtos Resultantes (*)</h4>
                        <input
                            type="number"
                            id="nproducts"
                            min="0"
                            placeholder='Insira o número de produtos resultantes...'
                            value={nResultingProducts}
                            onChange={(e) => setNResultingProducts(Number(e.target.value))}
                            required
                        />                            

                        <button type="submit" className="submit">Atualizar Produto</button>
                    </form>
                </div>
            )}
            
            {addModal && (
                <div onClick={() => setAddModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={addRecipe}>
                        <button onClick={() => setAddModal(false)}><RxCross2 /></button>

                        <h4 className="first">Produto (*)</h4>
                        <select
                            id="product"
                            value={productToShow}
                            onChange={(e) => setProductToShow(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecione um Produto...
                            </option>

                            {products.map((product) => (
                                <option key={product.id} value={product.name}>
                                    {product.name}
                                </option>
                            ))}
                        </select>

                        <h4>Preparação (*)</h4>
                        <textarea
                            placeholder='Insira a preparação da receita...'
                            className="notes-box"
                            value={preparation}
                            onChange={(e) => setPreparation(e.target.value)}
                            required
                        />

                        <h4>Número de Produtos Resultantes (*)</h4>
                        <input
                            type="number"
                            id="nproducts"
                            min="0"
                            placeholder='Insira o número de produtos resultantes...'
                            value={nResultingProducts}
                            onChange={(e) => setNResultingProducts(Number(e.target.value))}
                            required
                        />
                        
                        <button className="submit">Adicionar Receita</button>
                    </form>
                </div>
            )}
        </>
    )
}

export default RecipeSettings