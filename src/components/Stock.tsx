import { useEffect, useState } from "react"
import "../styles/Stock.css"
import { useToastNotification } from "../context/NotificationContext"
import api from "../services/api"
import { FaPencilAlt, FaPlus } from "react-icons/fa"
import { useLocation, useParams } from "react-router-dom"
import type { stockDTO } from "../dto/stockDTO"
import { useWebSocket } from "../context/WebSocketContext"
import UpdateProductQuantityForm from "./UpdateProductQuantityForm"
import useDecodedToken from "../hooks/hookDecodedToken"
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io"

type mode = "nameAsc" | "nameDesc" | "quantityAsc" | "quantityDesc"

const Stock: React.FC = () => {

    const [loadingStock, setLoadingStock] = useState<boolean>(true);
    const [stocks, setStocks] = useState<stockDTO[]>([]);
    const [showStocks, setShowStocks] = useState<stockDTO[]>([]);
    const [showMode, setShowMode] = useState<mode>("nameAsc");
    

    const {addToastNotification: addNotification} = useToastNotification();
    const { isAdmin } = useDecodedToken();

    const { bakeryId } = useParams<string>();
    const [ingredientIdSelected, setIngredientIdSelected] = useState<number>(0);
    const [reload, setReload] = useState(false);

    const refreshOrder = () => {
        setReload(prev => !prev);
    };

    const location = useLocation();
    const { messages } = useWebSocket();
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const fullPath = location.pathname + location.search;
        
        if (lastMessage.path?.some(p => p === fullPath)) {
            refreshOrder();
        }
    }, [messages]);

    useEffect (() => {
        const getStocks = async () => {
            try {
                
                const response = await api.get(`/stock/search-bakery-stock/${bakeryId}`);
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
        };

        getStocks();
    }, [reload]);

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

    const sortByNameDesc = (arr: typeof stocks) =>
        [...arr].sort((a, b) =>
            b.ingredientName.localeCompare(a.ingredientName)
        );

    const sortByQuantityAsc = (arr: typeof stocks) =>
        [...arr].sort((a, b) =>
            (a.quantity ?? 0) - (b.quantity ?? 0)
        );

    const sortByQuantityDesc = (arr: typeof stocks) =>
        [...arr].sort((a, b) =>
            (b.quantity ?? 0) - (a.quantity ?? 0)
        );

    useEffect (() => {
        if (showMode === "nameAsc") {
            setShowStocks(stocks);

        } else if (showMode === "nameDesc") {
            setShowStocks(sortByNameDesc(stocks));

        } else if (showMode === "quantityAsc") {
            setShowStocks(sortByQuantityAsc(stocks));

        } else {
            setShowStocks(sortByQuantityDesc(stocks));

        }

    }, [showMode, stocks]);


    const [addFormOpen, setAddFormOpen] = useState<boolean>(false);
    const [updateFormOpen, setUpgradeFormOpen] = useState<boolean>(false);

    return (
        <>
            <div className="show-stock">
            
                <table>
                    <thead>
                        <tr>
                            <th className="name" onClick={() => changeShowMode("name")}>
                                Ingrediente {showMode === "nameAsc" && <IoMdArrowDropupCircle />}{showMode === "nameDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                            <th className="quantity-stock" onClick={() => changeShowMode("quantity")}>
                                Quantidade {showMode === "quantityAsc" && <IoMdArrowDropupCircle />}{showMode === "quantityDesc" && <IoMdArrowDropdownCircle />}
                            </th>
                        </tr>
                    </thead>                  
                </table>

                <div className="table-body-stock">
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
                                            <tr key={stock.id}>
                                                <td className="name" title={stock.ingredientName}>{stock.ingredientName}</td>
                                                <td className="quantity-stock">
                                                    {isAdmin && <button className="edit" onClick={() => {setIngredientIdSelected(stock.ingredientId); setUpgradeFormOpen(true);}}><FaPencilAlt /></button>}
                                                    
                                                    <span>{Number(stock.quantity).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1").replace(".", ",")} {stock.unitSymbol}</span>
                                                    
                                                    {isAdmin && <button onClick={() => {setIngredientIdSelected(stock.ingredientId); setAddFormOpen(true);}}><FaPlus /></button>}
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
            
            {addFormOpen && (<UpdateProductQuantityForm stockType="ingredient" mode="add-stock" ingredientId={ingredientIdSelected} refreshOrder={() => refreshOrder()} openForm={(f) => setAddFormOpen(f)}/>)}
            {updateFormOpen && (<UpdateProductQuantityForm stockType="ingredient" mode="update-stock" ingredientId={ingredientIdSelected} refreshOrder={() => refreshOrder()} openForm={(f) => setUpgradeFormOpen(f)}/>)}
        </>
        
    )
}
export default Stock