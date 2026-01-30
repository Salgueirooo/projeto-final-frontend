import { useEffect, useState } from "react";
import "../styles/StatisticsBakery.css"
import { IoSearch } from "react-icons/io5";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { STUserDTO } from "../dto/STUserDTO";

const BakeryUserStats: React.FC = () => {
    const initialDate = new Date().toISOString().slice(0, 10);
    const initialYear = initialDate.slice(0, 4);

    const [searchedDate, setSearchedDate] = useState("");
    const [year, setYear] = useState(initialYear);
    
    const {addToastNotification: addNotification} = useToastNotification();
    const { bakeryId } = useParams<string>();
    
    const [stats, setStats] = useState<STUserDTO | null>(null);
    const [loadingStats, setLoadingStats] = useState<boolean>(false);

    const getStats = async () => {
        try {
            setLoadingStats(true);
            const response = await api.get(`/statistics/orders-user/${bakeryId}`,{
                params: {year}
            });
            setStats(response.data);
            setSearchedDate(year);
            
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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        getStats();
    };

    useEffect(() => {
        getStats();
    }, []);

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
    

    return (
        <div className="stats-panel">
            <div className="search-container2">
                <h2>{searchedDate}</h2>
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
            {loadingStats ? (<div className="spinner"></div>) : (
                <div className="stats-container">
                    <div className="stats1-user">
                        <div className="graphic-container">
                            <h2>N.º de Encomendas</h2>
                            <div className="bar-graphic-user">
                                
                                <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 320, height: 200 } }>
                                    <BarChart margin={{ right: 20 }} data={stats?.monthlyOrders}>
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
                        
                        <div className="best2">
                            {stats?.totalSpent?
                                (<h3><b>Total gasto durante o ano:</b>&nbsp;&nbsp;{formatCurrency(stats?.totalSpent.totalSpent)}</h3>)
                                
                                : <h3>Não existem dados sobre este ano.</h3>}
                            
                        </div>
                    </div>
                    <div className="stats2-user">
                        <h2>Produtos Mais Comprados</h2>
                        <div className="bar-graphic-user2">
                            
                            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 200 }}>
                                <BarChart
                                    layout="vertical"
                                    data={stats?.top10Products}
                                    margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
                                >
                                    <CartesianGrid strokeWidth={0.5} horizontal={false} />

                                    <YAxis
                                        type="category"
                                        dataKey="productName"
                                        stroke="#F2F4F3"
                                        width={1}
                                        tick={false}
                                    />

                                    <XAxis
                                        type="number"
                                        stroke="#F2F4F3"
                                    />

                                    <Tooltip
                                        formatter={(value) => {return `${value} un.`}}
                                        cursor={{ fill: "#3b3b3b" }}
                                        contentStyle={{
                                            backgroundColor: "#232323",
                                            border: "1px solid #3b3b3b",
                                            borderRadius: "5px",
                                            color: "#fff"
                                        }}
                                    />

                                    <Bar
                                        dataKey="totalQuantity"
                                        name="Quantidade"
                                        fill="#ecac23"
                                        radius={[0, 8, 8, 0]}
                                    >
                                        <LabelList
                                            dataKey="productName"
                                            position="insideLeft"
                                            fill="#F2F4F3"
                                            offset={10}
                                            fontWeight={"bold"}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default BakeryUserStats