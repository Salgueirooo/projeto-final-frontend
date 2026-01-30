import type { bakeryDTO } from "../dto/bakeryDTO";
import "../styles/ChooseBakery.css"
import "../styles/Statistics.css"
import { useEffect, useState } from "react";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import { useLogout } from "../services/logout";
import { TbLogout } from "react-icons/tb";
import { FaBell } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import useDecodedToken from "../hooks/hookDecodedToken";
import NotificationWSList from "../components/NotificationWSList";
import { useNotificationStore } from "../hooks/hookNotificationStore";
import { useNavigate } from "react-router-dom";
import type { STAllBakery } from "../dto/STAllBakeryDTO";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { IoIosArrowBack } from "react-icons/io";

const Statistics: React.FC = () => {
    const initialDate = new Date().toISOString().slice(0, 10);
    const initialYear = initialDate.slice(0, 4);
    const [year, setYear] = useState(initialYear);
    const { isAdmin } = useDecodedToken();

    const { addToastNotification: addNotification } = useToastNotification();

    const [bakeries, setBakeries] = useState<bakeryDTO[]>([]);
    const [bakeryIdSelected, setBakeryIdSelected] = useState(0);
    const [stats, setStats] = useState<STAllBakery>()

    const [loadingStats, setLoadingStats] = useState(false);
    const [reload, setReload] = useState(false);

    const refreshStats = () => {
        setReload(prev => !prev);
    };

    useEffect (() => {
        const getBakeries = async () => {
            try {
                const response = await api.get("/bakery/all");
                setBakeries(response.data);
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            }
        };

        getBakeries();
    }, []);

    useEffect (() => {
        const getAllStats = async () => {
            if (bakeryIdSelected > 0 && year.length > 0) {
                try {
                    setLoadingStats(true);
                    const response = await api.get(`/statistics/all-by-bakery/${bakeryIdSelected}`, 
                        {params: {year}}
                    );
                    setStats(response.data);
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
                    setLoadingStats(false);
                }
            }
            
        };

        getAllStats();
    }, [bakeryIdSelected, reload]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        refreshStats();
    }

    const [openNotifications, setOpenNotifications] = useState<boolean>(false);
    const lastAccess = localStorage.getItem("lastAccessNotifications");

    const { getAll } = useNotificationStore();
    const [newNotification, setNewNotification] = useState(0);
    const notifications = getAll();
    
    useEffect(() => {
        const newNotificationsCount = lastAccess
            ? notifications.filter(n => new Date(n.time) > new Date(lastAccess)).length
            : notifications.length;
        setNewNotification(newNotificationsCount);
    }, [getAll, openNotifications]);

    
    const navigate = useNavigate();
    const haddleLogout = useLogout();

    const formatCurrency = (value?: ValueType) => {
        if (value == null) return "0,00 €";

        const num = Number(value);
        if (Number.isNaN(num)) return "0,00 €";

        return num.toLocaleString("pt-PT", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatCurrencyRound = (value?: ValueType) => {
        if (value == null) return "0 €";

        const num = Number(value);
        if (Number.isNaN(num)) return "0 €";

        return num.toLocaleString("pt-PT", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0
        });
    };

    return (
        <>  
            <div className="top-bar">
                <span className="top-short">BakeTec</span>
                <span className="top-long">BakeTec - Sistema de Gestão de Pastelarias</span>
                
                {isAdmin && (
                    <>
                        <button className="conf" onClick={() => navigate("/select-bakery")}><IoIosArrowBack /></button> 
                    </>
                )}
                
                <button className={openNotifications ? ("notifications-selected") : ("notifications")} onClick={() => setOpenNotifications(true)}><FaBell /></button>
                {newNotification > 0 && (
                    <div className="new-notif">{newNotification}</div>
                )}
                <button className="logout" onClick={haddleLogout}><TbLogout /></button>
            </div>
            <div className="back-select">

                <div className="search-bar">
                    <div className="bakery-bar">
                        {bakeries.length === 0 ? (
                            <h3>Nenhuma Pastelaria encontrada.</h3>
                        ) : (
                            bakeries.map((bakery) => (
                                <button key={bakery.id} onClick={() => setBakeryIdSelected(bakery.id)} className={bakery.id === bakeryIdSelected ? "selected" : ""}>
                                    {bakery.name}
                                </button>
                                
                            ))
                        )}
                        
                    </div>
                    <div className="search-container">
                        
                        <form className="op-right" onSubmit={handleSubmit}>
                            <input 
                                className="year"
                                type="number"
                                id="year"
                                min={0}
                                max={initialYear}
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                            
                            <button type="submit" disabled={Number(year) <= 0}><IoSearch /></button>
                        </form>
                    </div>
                </div>
                <div className="stats-body">
                    {bakeryIdSelected > 0 ? (
                        loadingStats ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                <div className="all-stats-container">
                                    <div className="stats-sub-container">
                                        <h2>Número de Encomendas</h2>
                                        <div className="graphic">
                                            <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 320, height: 200 } }>
                                                <BarChart margin={{ top: 8, right: 20, bottom: 5 }} data={stats?.monthlyOrders}>
                                                    <CartesianGrid strokeWidth={0.5} vertical={false} />
                                                    <XAxis 
                                                        dataKey="monthName" 
                                                        stroke="#F2F4F3"
                                                        tickFormatter={(value: string) => value.slice(0, 3)}
                                                    />
                                                    <YAxis
                                                        stroke="#F2F4F3"
                                                    />
                                                    <Tooltip 
                                                        cursor={{ fill: "#3b3b3b" }}
                                                        contentStyle={{
                                                            backgroundColor: "#232323",
                                                            border: "1px solid #3b3b3b",
                                                            borderRadius: "5px",
                                                            color: "#fff"
                                                        }}
                                                    />
                                                    <Bar dataKey="totalOrders" name={"N.º de Encomendas"} fill="#ecac23" radius={[8, 8, 0, 0]}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        
                                    </div>
                                    
                                    <div className="stats-sub-container-botton">
                                        <h2>Produtos Vendidos</h2>
                                        <div className="graphic">
                                            <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 320, height: 200 } }>
                                                <BarChart margin={{ top: 8, right: 20, bottom: 4 }} data={stats?.productSalesList}>
                                                    <CartesianGrid strokeWidth={0.5} vertical={false} />
                                                    <XAxis 
                                                        dataKey="productName" 
                                                        stroke="#F2F4F3"
                                                        
                                                    />
                                                    <YAxis
                                                        stroke="#F2F4F3"
                                                    />
                                                    <Tooltip 
                                                        cursor={{ fill: "#3b3b3b" }}
                                                        contentStyle={{
                                                            backgroundColor: "#232323",
                                                            border: "1px solid #3b3b3b",
                                                            borderRadius: "5px",
                                                            color: "#fff"
                                                        }}
                                                    />
                                                    <Bar dataKey="totalQuantity" name={"Quantidade vendida"} fill="#ecac23" radius={[8, 8, 0, 0]}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="all-stats-container">
                                    <div className="stats-sub-container">
                                        <h2>Vendas (€)</h2>
                                        <div className="graphic">
                                            <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 320, height: 200 } }>
                                                <BarChart margin={{ top: 8, right: 20, bottom: 4 }} data={stats?.productCostList}>
                                                    <CartesianGrid strokeWidth={0.5} vertical={false} />
                                                    <XAxis 
                                                        dataKey="productName" 
                                                        stroke="#F2F4F3"
                                                        
                                                    />
                                                    <YAxis
                                                        stroke="#F2F4F3"
                                                        tickFormatter={(value) => formatCurrencyRound(value)}
                                                        width={80}
                                                    />
                                                    <Tooltip 
                                                        formatter={(value) => formatCurrency(value)}
                                                        cursor={{ fill: "#3b3b3b" }}
                                                        contentStyle={{
                                                            backgroundColor: "#232323",
                                                            border: "1px solid #3b3b3b",
                                                            borderRadius: "5px",
                                                            color: "#fff"
                                                        }}
                                                    />
                                                    <Bar dataKey="totalRevenue" name={"Receita"} fill="#ecac23" radius={[8, 8, 0, 0]}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        
                                    </div>
                                    <div className="stats-sub-container-botton-2">
                                        <div className="top-stat">
                                            {stats?.topProductSale ?
                                                (<h3><b>Produto mais vendido:</b>&nbsp;&nbsp;{stats?.topProductSale.productName} - {stats?.topProductSale.totalQuantity} un.</h3>) : 
                                                (<h3>Não existem dados sobre este intervalo.</h3>)
                                            }
                                        </div>
                                        <div className="top-stat">
                                            {stats?.topProductCost?
                                                (<h3><b>Produto com maior receita:</b>&nbsp;&nbsp;{stats?.topProductCost.productName} - {formatCurrency(stats.topProductCost.totalRevenue)}</h3>) :
                                                <h3>Não existem dados sobre este intervalo.</h3>
                                            }
                                        </div>
                                        <div className="top-stat">
                                            {stats?.topClientSale?
                                                (<h3><b>Melhor Cliente (quant.):</b>&nbsp;&nbsp;{stats?.topClientSale.clientName} - {stats.topClientSale.totalQuantity} prod.</h3>) : 
                                                <h3>Não existem dados sobre este intervalo.</h3>
                                            }
                                        </div>
                                        <div className="top-stat">
                                            {stats?.topClientSpending?
                                                (<h3><b>Melhor Cliente (€):</b>&nbsp;&nbsp;{stats?.topClientSpending.clientName} - {formatCurrency(stats.topClientSpending.totalSpent)}</h3>) :
                                                <h3>Não existem dados sobre este intervalo.</h3>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                            
                        )
                    ) : (
                        bakeries.length !== 0 && (
                            <h3>Nenhuma Pastelaria selecionada.</h3>
                        )
                        
                    )}
                </div>

            </div>
            
            {openNotifications && (
                <NotificationWSList mode={"main"} onSwitch={(m) => setOpenNotifications(m)} lastAccess={lastAccess}/>
            )}
            
        </>
    )
}

export default Statistics