import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import "../styles/RecipeStartForm.css"

type mode = "recipeStockStatus" | "chooseDose"

interface Props {
    onSwitch: (modalForm: boolean) => void;
    setDose: (dose: number) => void;
    setMode: (mode: mode) => void;
}

interface Dose {
    id: number;
    symbol: string;
    quantity: number;
}

const RecipeStartForm: React.FC<Props> = ({onSwitch, setDose, setMode}) => {
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

    const getDoseRequest = () => {
        return doseSelected.quantity === 0 ? (customDose) : (doseSelected.quantity);
    }

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

                <button disabled={doseSelected.quantity === 0 && customDose <= 0} className="start-recipe" onClick={() => { setDose(getDoseRequest()); setMode("recipeStockStatus") }}>Iniciar Receita</button>
            </div>
        </div>
    )
}

export default RecipeStartForm