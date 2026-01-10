import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import "../styles/MakeOrderForm.css"
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useNavigate, useParams } from "react-router-dom";
import { HomeTab } from "../hooks/HomeTab";
import type { VarsMakeOrderDTO } from "../dto/varsMakeOrderDTO";

interface Props {
    orderId: number,
    onSwitch: (modalForm: boolean) => void;
}

const MakeOrderForm: React.FC<Props> = ({orderId, onSwitch}) => {

    const navigate = useNavigate();

    const [notes, setNotes] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [loading, setLoading] = useState(false);
    const [orderVars, setOrderVars] = useState<VarsMakeOrderDTO>({minOrderHours: 1, openingTime: "08:00", closingTime: "20:00"});

    const dateWithTime = (date: Date, time: string) => {
        const [h, m] = time.split(":").map(Number);
        const d = new Date(date);
        d.setHours(h, m, 0, 0);
        return d;
    };

    const now = new Date();
    let minDateTime = new Date(now.getTime() + orderVars.minOrderHours * 60 * 60 * 1000);

    const openingDateTime = dateWithTime(minDateTime, orderVars.openingTime);
    const closingDateTime = dateWithTime(minDateTime, orderVars.closingTime);

    if (minDateTime < openingDateTime) {
        minDateTime = openingDateTime;

    } else if (minDateTime > closingDateTime) {
        minDateTime = dateWithTime(
            new Date(minDateTime.setDate(minDateTime.getDate() + 1)),
            orderVars.openingTime
        );
    }

    const minDate = minDateTime.toISOString().split("T")[0];

    const minTime =
        selectedDate === minDate
            ? minDateTime.toTimeString().slice(0, 5)
            : orderVars.openingTime;



    const { addToastNotification: addNotification } = useToastNotification();

    const { bakeryId } = useParams<{ bakeryId: string }>();

    useEffect(() => {
        const getMinTime = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/system-config/get-make-order`);
                setOrderVars(response.data);

            } catch (err: any) {
                if(err.response) {
                    console.error(err.response.data);
                    addNotification(err.response.data, true);
                }
                else {
                    console.error(err);
                    addNotification("Erro ao efetuar a Encomenda.", true);
                }
            } finally {
                setLoading(false);
            }
        }

        getMinTime();
            
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await api.put("/order/make", {id: orderId, date: `${selectedDate}T${selectedTime}`, clientNotes: notes });

            addNotification("A sua Encomenda foi efetuada.", false);
            onSwitch(false);
            navigate(`/home/${bakeryId}/${HomeTab.Accompany}`);


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
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <>
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
                                max={orderVars.closingTime}
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
                    </>
                )}
            </div>
        </div>
    )
}

export default MakeOrderForm