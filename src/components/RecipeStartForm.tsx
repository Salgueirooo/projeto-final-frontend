import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import "../styles/RecipeStartForm.css"
import { useToastNotification } from "../context/NotificationContext";
import api from "../services/api";
import { useParams } from "react-router-dom";

interface Props {
    recipeId: number;
    onSwitch: (modalForm: boolean) => void;
}

interface Dose {
    id: number;
    symbol: string;
    quantity: number;
}

const RecipeStartForm: React.FC<Props> = ({recipeId, onSwitch}) => {

    const { bakeryId } = useParams<string>();
    const [customDose, setCustomDose] = useState<number>(1);

    const doses: Dose[] = [
        {
            id: 1,
            symbol: "1/4",
            quantity: 0.25
        },
        {
            id: 2,
            symbol: "1/2",
            quantity: 0.5
        },
        {
            id: 3,
            symbol: "1",
            quantity: 1
        },
        {
            id: 4,
            symbol: "2",
            quantity: 2
        },
        {
            id: 5,
            symbol: "4",
            quantity: 4
        },
        {
            id: 6,
            symbol: "Outro",
            quantity: 0
        }
    ]

    const {addToastNotification: addNotification} = useToastNotification();

    const addProducedRecipe = async () => {
        if (doseSelected.quantity === 0 && customDose <= 0) {
            addNotification("A dose deve ser maior que 0.", true);
        
        } else {
            
            try {
                
                await api.post("/produced-recipe/add", {
                    recipeId,
                    bakeryId,
                    dose: doseSelected.quantity === 0 ? (customDose) : (doseSelected.quantity)
                });

                addNotification("Receita iniciada com sucesso.", false);
                onSwitch(false);

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

    const [doseSelected, setDoseSelected] = useState<Dose>(doses[2]);

    return (
        <div className="back-modal" onClick={() => onSwitch(false)}>
                        
            <div className="recipe-start-form" onClick={(e) => e.stopPropagation()}>
                <button className="close-bot" onClick={() => onSwitch(false)}><RxCross2 /></button>
                
                <h2>Escolha a dose da receita</h2>
                <div className="option-container">
                    {doses.map((dose) => (
                        <button key={dose.id} className={dose.id === doseSelected.id ? "selected" : "non-selected"} 
                            onClick={() => setDoseSelected(dose)}>{dose.symbol}</button>
                    ))}
                    {doseSelected.id === 6 && (
                        <input
                            type = "number"
                            value= {customDose}
                            min={0}
                            step="any"
                            onChange={(e) => {
                                const value = e.target.value;
                                setCustomDose(value === "" ? 0 : parseFloat(value));
                            }}
                        />
                    )}
                    
                </div>

                <button className="start-recipe" onClick={() => addProducedRecipe()}>Iniciar Receita</button>
            </div>
        </div>
    )
}

export default RecipeStartForm