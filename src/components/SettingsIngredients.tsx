import { useEffect, useState } from "react";
import "../styles/Settings.css"
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import type { UnitDTO } from "../dto/unitDTO";
import type { IngredientDTO } from "../dto/ingredientDTO";

type mode = "nameAsc" | "nameDesc"

const IngredientSettings: React.FC = () => {

    const [showMode, setShowMode] = useState<mode>("nameAsc");
    const { addToastNotification: addNotification } = useToastNotification();

    const [loadingIngredients, setLoadingIngredients] = useState(true);
    const [reload, setReload] = useState(false);
    const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
    const [showIngredients, setShowIngredients] = useState<IngredientDTO[]>([]);
    const [units, setUnits] = useState<UnitDTO[]>([]);

    const [addModal, setAddModal] = useState(false);

    const [name, setName] = useState("");
    const [unitDescription, setUnitDescription] = useState("");
    

    const refreshIngredients = () => {
        setReload(prev => !prev);
    };

    const resetInputValues = () => {
        setName("");
        setUnitDescription("");
    }

    const addIngredient = async (event: React.FormEvent) => {
        event.preventDefault();   
        
        try {
            await api.post(`/ingredient/add`, {name, unitDescription});
            refreshIngredients();
            setAddModal(false);
            addNotification("O Ingrediente foi adicionado.", false);
            
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

    const deleteIngredient = async (id: number) => {
        if (id > 0) {
            try {
                await api.delete(`/ingredient/delete/${id}`);
                refreshIngredients();
                addNotification("O Ingrediente foi eliminado.", false);
                
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
            } finally {
                setLoadingIngredients(false);
            }
        };

        getIngredients();
    }, [reload]);

    useEffect (() => {
        const getUnits= async () => {
            try {
                const response = await api.get(`/initialize/get-measurent-units`);
                setUnits(response.data);
                
            } catch (err:any) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            } 
        };

        getUnits();
    }, []);

    const changeShowMode = () => {
         
        if (showMode === "nameAsc") {
            setShowMode("nameDesc");
        } else {
            setShowMode("nameAsc");
        }
    }

    const sortByNameDesc = (arr: typeof ingredients) =>
        [...arr].sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowIngredients(ingredients);

        } else if (showMode === "nameDesc") {
            setShowIngredients(sortByNameDesc(ingredients));

        }

    }, [showMode, ingredients]);

    return (
        <>
            <div className="show-setting">
                <div className="header">
                    <h2>Gestão de Ingredientes</h2>
                    <button onClick={() => { resetInputValues(); setAddModal(true) }}><FaPlus /></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode()}>
                                Ingredientes {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
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

                            {loadingIngredients ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showIngredients.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem Ingredientes para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showIngredients.map(ingredient => (
                                            
                                            <tr key={ingredient.id}>
                                                <td className="name" title={ingredient.name}>{ingredient.name}</td>
                                                <td className="button-container">
                                                    <button className="remove" onClick={() => deleteIngredient(ingredient.id)}><RxCross1 /></button>
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
            
            {addModal && (
                <div onClick={() => setAddModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={addIngredient}>
                        <button type="button" onClick={() => setAddModal(false)}><RxCross2 /></button>
                        
                        <h4 className="first">Nome (*)</h4>
                        <input
                            type="text"
                            id="name"
                            placeholder='Insira o nome da categoria...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <h4>Unidade (*)</h4>
                        <select
                            id="unit"
                            value={unitDescription}
                            onChange={(e) => setUnitDescription(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecione uma unidade...
                            </option>

                            {units.map((unit) => (
                                <option key={unit.symbol} value={unit.description}>
                                    {unit.description}
                                </option>
                            ))}
                        </select>
                        
                        <button type="submit" className="submit">Adicionar Ingrediente</button>

                    </form>
                </div>
            )}
        </>
    )
}

export default IngredientSettings