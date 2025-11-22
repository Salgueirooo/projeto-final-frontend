import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import "../styles/MakeOrderForm.css"
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

interface Props {
    orderId: number,
    onSwitch: (modalForm: boolean) => void;
    onSwitchOp: (op: number) => void;
}

const MakeOrderForm: React.FC<Props> = ({orderId, onSwitch, onSwitchOp}) => {

    const [notes, setNotes] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    const minDate = `${year}-${month}-${day}`;

    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    const isTomorrow = selectedDate === minDate;

    const minTime = isTomorrow ? currentTime : "00:00";

    const { addNotification } = useNotification();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await api.put("/order/make", {id: orderId, date: `${selectedDate}T${selectedTime}`, clientNotes: notes });

            addNotification("A sua Encomenda foi efetuada.", false);
            onSwitch(false);
            onSwitchOp(1);


        } catch (err: any) {
            if(err.response) {
                console.error(err.response.data);
                addNotification(err.response.data, true);
            }
            else {
                console.error(err);
                addNotification("Erro ao efetuar a Encomenda.", true);
            }
        }
    };

    return (

        <div className="back-modal" onClick={() => onSwitch(false)}>
                        
            <div className="order-form" onClick={(e) => e.stopPropagation()}>
                <button className="close-bot" onClick={() => onSwitch(false)}><RxCross2 /></button>
                
                <form onSubmit={handleSubmit}>
                    <h3 className="first-input"><b>Dia da Entrega</b></h3>
                    <input
                        required
                        className="date"
                        type="date"
                        min={minDate}
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime("");
                        }}
                    />

                    <h3><b>Hora da Entrega</b></h3>
                    <input
                        required
                        className="time"
                        type="time"
                        value={selectedTime}
                        min={minTime}
                        disabled={!selectedDate}
                        onChange={(e) => setSelectedTime(e.target.value)}
                    />
                    
                    <h3><b>Notas da Encomenda</b> (Opcional)</h3>
                    <textarea
                        placeholder="Escreva aqui as notas da sua encomenda..."
                        className="notes-box"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}>
                    </textarea>

                    <button type="submit" className="submit">Finalizar encomenda</button>
                </form>
                
                

                
                
            
            </div>
        </div>
    )
}

export default MakeOrderForm