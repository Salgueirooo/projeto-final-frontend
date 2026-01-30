import "../styles/SearchOrders.css"
import { IoSearch } from "react-icons/io5"
import { useEffect, useState } from "react"
import api from "../services/api"
import { useToastNotification } from "../context/NotificationContext"
import { getStringDay } from "../hooks/hookStringDay"
import { getTodayDate } from "../hooks/hookTodayDate"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { HomeTab } from "../hooks/HomeTab"
import { useWebSocket } from "../context/WebSocketContext"
import type { producedRecipeDTO } from "../dto/producedRecipeDTO"
import { groupRecipesByHour } from "../hooks/hookGroupRecipesByHour"
import RecipeHistoryDetails from "./RecipeHistoryDetails"


const RecipeHistory: React.FC = () => {

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { bakeryId } = useParams<string>();
    const todayDate = getTodayDate();

    const initialDate = params.get("date") ?? (todayDate);

    const [date, setDate] = useState<string>(initialDate);
    const [loadingRecipe, setLoadingRecipe] = useState<boolean>(false);
    const [dateSearched, setDateSearched] = useState<string>("");
    const [searched, setSearched] = useState<boolean>(true);
    
    const {addToastNotification: addNotification} = useToastNotification();

    const [recipes, setRecipes] = useState<producedRecipeDTO[]>([]);

    const [reload, setReload] = useState(false);

    const refreshOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setSearched(true);
        navigate(`/home/${bakeryId}/${HomeTab.HistoryRecipes}?date=${date}`);
        setReload(prev => !prev);
    };

    const refreshOrderNoArg = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getOrder = async () => {
            try {
                searched && setLoadingRecipe(true);
                if(date.length === 10) {
                    const response = await api.get(`/produced-recipe/get-all-by-date/${bakeryId}`,
                        {params: {date}});
                    setRecipes(response.data);
                    setDateSearched(date);
                }
                
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
                searched && setLoadingRecipe(false);
                setSearched(false);
            }
        };

        getOrder();
    }, [reload]);

    const location = useLocation();
    const { messages } = useWebSocket();
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const fullPath = location.pathname + location.search;
        
        console.log(location.pathname);
        console.log(lastMessage.path);
        
        if (lastMessage.path?.some(p => p === fullPath)) {
            refreshOrderNoArg();
        }
    }, [messages]);

    const grouped = groupRecipesByHour(recipes);

    return (
        <>
            <div className="order-container-header">
                <h2 className="day-ready">{getStringDay(dateSearched, todayDate)}</h2>
                <form className="space-search-order-bar" onSubmit={refreshOrder}>
                    <div className="search-order-box">
                        <input className="search-order-text"
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" onClick={() => setSearched(true)} disabled={date.length !== 10}><IoSearch /></button>
                </form>
                <h2 className="day-ready2">{getStringDay(dateSearched, todayDate)}</h2>
            </div>
            
            <div className="orders-container">
                {loadingRecipe ? (
                    <div className="spinner"></div>
                ) : (
                    recipes.length === 0 ? (
                       <h3>Não foram encontradas encomendas para essa data.</h3>
                       
                    ) : (
                        
                        Object.entries(grouped).map(([hour, recipes]) => (
                            <div key={hour}>
                                <h2>{hour} - {hour.replace(":00", ":59")}</h2>

                                <div className="orders-group">
                                    {recipes.map((recipe) => (
                                        <RecipeHistoryDetails key={recipe.id} recipeInfo={recipe} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )
                    
                )}
            </div>
        </>
    )
}

export default RecipeHistory