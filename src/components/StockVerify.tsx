import { useEffect, useState } from "react"
import "../styles/StockVerify.css"
import { useToastNotification } from "../context/NotificationContext"
import api from "../services/api"
import { FaCheck } from "react-icons/fa"
import { useLocation, useParams } from "react-router-dom"
import { useWebSocket } from "../context/WebSocketContext"
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io"
import { getTodayDate } from "../hooks/hookTodayDate"
import { IoSearch } from "react-icons/io5"
import type { IngredientStockCheckDTO } from "../dto/ingredientStockCheckDTO"
import { ImCross } from "react-icons/im"
import { getStringDay } from "../hooks/hookStringDay"

type mode = "nameAsc" | "nameDesc" | "quantityAsc" | "quantityDesc"

const StockVerify: React.FC = () => {

    const todayDate = getTodayDate();
    
    const [loadingStock, setLoadingStock] = useState<boolean>(false);
    const [stocks, setStocks] = useState<IngredientStockCheckDTO[]>([]);
    const [showStocks, setShowStocks] = useState<IngredientStockCheckDTO[]>([]);
    const [showMode, setShowMode] = useState<mode>("nameAsc");
    
    const [startDate, setStartDate] = useState(todayDate);
    const [endDate, setEndDate] = useState("");
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
            if (startDate.length === 10 && endDate.length === 10) {
                try {
                    setLoadingStock(true);
                    const response = await api.get(`/stock/orders-stock-status/${bakeryId}`,
                        {params: {startDate, endDate}}
                    );
                    updateDateSearched();
                    setStocks(response.data);
                    
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
                    setLoadingStock(false);
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

    type button = "name" | "quantity"
    const changeShowMode = (buttonSelected: button) => {
        
        if (buttonSelected === "name") {
            
            if (showMode === "nameAsc") {
                setShowMode("nameDesc");
            } else {
                setShowMode("nameAsc");
            }
        } else {

            if (showMode === "quantityAsc") {
                setShowMode("quantityDesc");
            } else {
                setShowMode("quantityAsc");
            }
        }
    }

    const sortByNameAsc = (arr: typeof stocks) =>
        [...arr].sort((a, b) =>
            a.ingredient.name.localeCompare(b.ingredient.name)
        );

    const sortByNameDesc = (arr: typeof stocks) =>
        [...arr].sort((a, b) =>
            b.ingredient.name.localeCompare(a.ingredient.name)
        );

    const sortByQuantityAsc = (arr: typeof stocks) =>
        [...arr].sort((a, b) =>
            (a.quantityNeeded ?? 0) - (b.quantityNeeded ?? 0)
        );

    const sortByQuantityDesc = (arr: typeof stocks) =>
        [...arr].sort((a, b) =>
            (b.quantityNeeded ?? 0) - (a.quantityNeeded ?? 0)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowStocks(sortByNameAsc(stocks));

        } else if (showMode === "nameDesc") {
            setShowStocks(sortByNameDesc(stocks));

        } else if (showMode === "quantityAsc") {
            setShowStocks(sortByQuantityAsc(stocks));

        } else {
            setShowStocks(sortByQuantityDesc(stocks));

        }

    }, [showMode, stocks]);

    const updateDateSearched = () => {
        if (startDate === endDate) {
            setDateSearched(getStringDay(startDate, todayDate));
        } else {
            setDateSearched(`${getStringDay(startDate, todayDate)} - ${getStringDay(endDate, todayDate)}`);
        }
    }

    return (
        <>

            <div className="show-verify-stock">
                <div className="inline2">
                    <h2 className="date-searched">{dateSearched}</h2>
                    <form className="header" onSubmit={refreshOrder}>
                        <input className="search-order-text"
                            type="date"
                            id="date1"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={todayDate}
                            required
                        />
                        <h2 className="dash">-</h2>
                        <input className="search-order-text"
                            type="date"
                            id="date2"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={todayDate}
                            required
                        />
                        <button type="submit" className="search"><IoSearch /></button>
                    </form>
                    <h2 className="date-searched2">{dateSearched}</h2>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode("name")}>
                                Ingrediente {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="quantity-stock-verify" onClick={() => changeShowMode("quantity")}>
                                Quantidade (N/E) {showMode === "quantityAsc" && <IoMdArrowDropupCircle />}{showMode === "quantityDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="sufficient">
                                Suficiente
                            </th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-verify-stock">
                    <table className="cart-table">
                        <tbody>

                            {loadingStock ? (
                                <tr>
                                    <td><div className="spinner"></div></td>
                                </tr>
                                
                            ) : (
                                <>
                                    {showStocks.length === 0 ? (
                                        <tr>
                                            <td className="name">Não existem ingredientes para mostrar.</td>
                                        </tr>
                                    ) : (
                                        showStocks.map(stock => (
                                            <tr key={stock.ingredient.id}>
                                                <td className="name" title={stock.ingredient.name}>{stock.ingredient.name}</td>
                                                <td className="quantity-stock-verify">
                                                    
                                                    <span>{Number(stock.quantityNeeded).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1").replace(".", ",")} / {Number(stock.availableQuantity).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1").replace(".", ",")} {stock.ingredient.unitSymbol}</span>

                                                </td>
                                                <td className={stock.sufficient ? "sufficient" : "insufficient"}>{stock.sufficient ? (<FaCheck />) : (<ImCross />)}</td>

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
export default StockVerify