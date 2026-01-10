import { useEffect, useState } from "react"
import "../styles/RecipeTasksList.css"
import { useToastNotification } from "../context/NotificationContext"
import api from "../services/api"
import { useLocation, useParams } from "react-router-dom"
import { useWebSocket } from "../context/WebSocketContext"
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io"
import { getTodayDate } from "../hooks/hookTodayDate"
import { IoSearch } from "react-icons/io5"
import { getStringDay } from "../hooks/hookStringDay"
import type { RecipeProductionTaskDTO } from "../dto/recipeProductionTaskDTO"

type mode = "nameAsc" | "nameDesc" | "quantityAsc" | "quantityDesc" | "productsRequiredAsc" | "productsRequiredDesc"

const RecipeTasksList: React.FC = () => {

    const todayDate = getTodayDate();
    
    const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
    const [tasks, setTasks] = useState<RecipeProductionTaskDTO[]>([]);
    const [showTasks, setShowTasks] = useState<RecipeProductionTaskDTO[]>([]);
    const [showMode, setShowMode] = useState<mode>("nameAsc");
    
    const [date, setDate] = useState(todayDate);
    const [dateSearched, setDateSearched] = useState("");

    const {addToastNotification: addNotification} = useToastNotification();

    const { bakeryId } = useParams<string>();
    const [reload, setReload] = useState(false);

    const refreshOrderNoArgs = () => {
        setReload(prev => !prev);
    };

    const location = useLocation();
    const { messages } = useWebSocket();
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const fullPath = location.pathname + location.search;
        
        if (lastMessage.path?.some(p => p === fullPath)) {
            refreshOrderNoArgs();
        }
    }, [messages]);

    useEffect (() => {
        const getStocks = async () => {
            if (date.length === 10) {
                try {
                    setLoadingTasks(true);
                    const response = await api.get(`/recipe/get-production-tasks/${bakeryId}`,
                        {params: {date}}
                    );
                    setDateSearched(getStringDay(date, todayDate));
                    setTasks(response.data);
                    
                } catch (err) {
                    console.error(err);
                    addNotification("Erro na comunicação com o Servidor.", true);
                } finally {
                    setLoadingTasks(false);
                }
            }
            
        };

        getStocks();
    }, [reload]);

    const refreshOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setReload(prev => !prev);
        // setSearched(true);
    };

    type button = "name" | "quantity" | "required"
    const changeShowMode = (buttonSelected: button) => {
        
        if (buttonSelected === "name") {
            
            if (showMode === "nameAsc") {
                setShowMode("nameDesc");
            } else {
                setShowMode("nameAsc");
            }
        } else if (buttonSelected === "quantity") {

            if (showMode === "quantityAsc") {
                setShowMode("quantityDesc");
            } else {
                setShowMode("quantityAsc");
            }
        } else {
            if (showMode === "productsRequiredAsc") {
                setShowMode("productsRequiredDesc");
            } else {
                setShowMode("productsRequiredAsc");
            }
        }
    }

    const sortByNameAsc = (arr: typeof tasks) =>
        [...arr].sort((a, b) =>
            a.recipeName.localeCompare(b.recipeName)
        );

    const sortByNameDesc = (arr: typeof tasks) =>
        [...arr].sort((a, b) =>
            b.recipeName.localeCompare(a.recipeName)
        );

    const sortByQuantityAsc = (arr: typeof tasks) =>
        [...arr].sort((a, b) =>
            (a.requiredDoses ?? 0) - (b.requiredDoses ?? 0)
        );

    const sortByQuantityDesc = (arr: typeof tasks) =>
        [...arr].sort((a, b) =>
            (b.requiredDoses ?? 0) - (a.requiredDoses ?? 0)
        );

    const sortByRequiredAsc = (arr: typeof tasks) =>
        [...arr].sort((a, b) =>
            (a.totalProducts ?? 0) - (b.totalProducts ?? 0)
        );

    const sortByRequiredDesc = (arr: typeof tasks) =>
        [...arr].sort((a, b) =>
            (b.totalProducts ?? 0) - (a.totalProducts ?? 0)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowTasks(sortByNameAsc(tasks));

        } else if (showMode === "nameDesc") {
            setShowTasks(sortByNameDesc(tasks));

        } else if (showMode === "quantityAsc") {
            setShowTasks(sortByQuantityAsc(tasks));

        } else if (showMode === "quantityDesc") {
            setShowTasks(sortByQuantityDesc(tasks));

        } else if (showMode === "productsRequiredAsc") {
            setShowTasks(sortByRequiredAsc(tasks));

        } else {
            setShowTasks(sortByRequiredDesc(tasks));
        }

    }, [showMode, tasks]);

    const getProgress = (producedDoses: number, requiredDoses: number) => {
        if (producedDoses <= requiredDoses) {
            return Math.round((producedDoses / requiredDoses) * 100);
        } else {
            return 100;
        }
    }

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('pt-PT', {
            maximumFractionDigits: 3,
        }).format(value).toString().replace(".", ",");
    }

    return (
        <>

            <div className="show-verify-stock">
                <div className="inline">
                    <h2>{dateSearched}</h2>
                    <form className="header" onSubmit={refreshOrder}>
                        <input className="search-order-text"
                            type="date"
                            id="date1"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={todayDate}
                            required
                        />
                        <button type="submit" className="search"><IoSearch /></button>
                    </form>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th className="recipe-name" onClick={() => changeShowMode("name")}>
                                Receita {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="dose" onClick={() => changeShowMode("quantity")}>
                                Doses (F/N) {showMode === "quantityAsc" && <IoMdArrowDropupCircle />}{showMode === "quantityDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="dose" onClick={() => changeShowMode("required")}>
                                Produtos Necessários
                            </th>
                            <th className="dose">
                                Progresso
                            </th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-verify-stock">
                    <table className="cart-table">
                        <tbody>

                            {loadingTasks ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showTasks.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem tarefas para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showTasks.map(task => (
                                            <tr key={task.recipeId}>
                                                <td className="recipe-name" title={task.recipeName}>{task.recipeName}</td>
                                                <td className="dose">
                                                    
                                                    <span>{formatNumber(task.producedDoses)} / {formatNumber(task.requiredDoses)}</span>

                                                </td>
                                                <td className="dose">{task.totalProducts}</td>
                                                <td className="dose">
                                                    <div className="progress-container">
                                                        <div
                                                            className="progress-bar"
                                                            style={{ width: `${getProgress(task.producedDoses, task.requiredDoses)}%` }}
                                                        >
                                                            <span className="progress-text">{getProgress(task.producedDoses, task.requiredDoses)}%</span>
                                                        </div>
                                                    </div>
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
        </>
    )
}
export default RecipeTasksList