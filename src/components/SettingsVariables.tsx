import { useEffect, useState } from "react";
import "../styles/Settings.css"
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import type { SystemConfigDTO } from "../dto/systemConfigDTO";
import { FaPencilAlt } from "react-icons/fa";

type mode = "nameAsc" | "nameDesc"
type variableType = "time" | "number" | null

const VariableSettings: React.FC = () => {

    const [showMode, setShowMode] = useState<mode>("nameAsc");
    const { addToastNotification: addNotification } = useToastNotification();

    const [loadingVariables, setLoadingVariables] = useState(true);
    const [reload, setReload] = useState(false);
    const [variables, setVariables] = useState<SystemConfigDTO[]>([]);
    const [showVariables, setShowVariables] = useState<SystemConfigDTO[]>([]);
    
    const [variableMode, setVariableMode] = useState<variableType>(null);

    const [updateModal, setUpdateModal] = useState(false);

    const [variableSelected, setVariableSelected] = useState(0);
    const [configValue, setConfigValue] = useState("");
    

    const refreshVariables = () => {
        setReload(prev => !prev);
    };

    const resetInputValues = () => {
        setVariableSelected(0);
        setConfigValue("");
        setVariableMode(null);
    }

    const setInputValues = (variable: SystemConfigDTO) => {
        resetInputValues();

        setVariableSelected(variable.id);
        setConfigValue(variable.configValue);

        if (variable.configKey.includes("HOURS") || variable.configKey.includes("DAYS")) {
            setVariableMode("number")
        } else if (variable.configKey.includes("TIME")) {
            setVariableMode("time");
        }
    }

    const updateVariable = async (event: React.FormEvent) => {
        event.preventDefault();   
        
        if (variableSelected > 0) {
            try {
                await api.put(`/system-config/update/${variableSelected}`, configValue,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                refreshVariables();
                setUpdateModal(false);
                addNotification("A Variável foi atualizada.", false);
                
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
        const getVariables = async () => {
            try {
                const response = await api.get(`/system-config/all`);
                setVariables(response.data);
                
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
                setLoadingVariables(false);
            }
        };

        getVariables();
    }, [reload]);

    const changeShowMode = () => {
         
        if (showMode === "nameAsc") {
            setShowMode("nameDesc");
        } else {
            setShowMode("nameAsc");
        }
    }

    const sortByNameAsc = (arr: typeof variables) =>
        [...arr].sort((a, b) =>
            a.description.localeCompare(b.description)
        );

    const sortByNameDesc = (arr: typeof variables) =>
        [...arr].sort((a, b) =>
            b.description.localeCompare(a.description)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowVariables(sortByNameAsc(variables));

        } else if (showMode === "nameDesc") {
            setShowVariables(sortByNameDesc(variables));

        }

    }, [showMode, variables]);

    return (
        <>
            <div className="show-setting">
                <div className="header">
                    <h2>Gestão de Variáveis</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode()}>
                                Variáveis {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="button-container">
                                Atualizar
                            </th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-settings">
                    <table className="cart-table">
                        <tbody>

                            {loadingVariables ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showVariables.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem Variáveis para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showVariables.map(variable => (
                                            
                                            <tr key={variable.id}>
                                                <td className="name" title={variable.description}>{variable.description}</td>
                                                <td className="button-container">
                                                    <button className="edit" onClick={() => {setInputValues(variable); setUpdateModal(true);}}><FaPencilAlt /></button>
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
            
            {updateModal && (
                <div onClick={() => setUpdateModal(false)} className="back-modal">
                    <form onClick={(e) => e.stopPropagation()} className="settings-form" onSubmit={updateVariable}>
                        <button type="button" onClick={() => setUpdateModal(false)}><RxCross2 /></button>
                        
                        <h4 className="first">Valor da Variável (*)</h4>
                        {variableMode === "number" && (
                            <input
                                type="number"
                                id="value"
                                min="1"
                                placeholder='Insira o valor da variável...'
                                value={configValue}
                                onChange={(e) => setConfigValue(e.target.value)}
                                required
                            />
                        )}
                        {variableMode === "time" && (
                            <input
                                required
                                className="time"
                                type="time"
                                value={configValue}
                                onChange={(e) => setConfigValue(e.target.value)}
                            />
                        )}
                        <button type="submit" className="submit">Atualizar Variável</button>

                    </form>
                </div>
            )}
        </>
    )
}

export default VariableSettings