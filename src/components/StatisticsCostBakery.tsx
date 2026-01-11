import { useState } from "react";
import "../styles/StatisticsBakery.css"
import { IoSearch } from "react-icons/io5";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useToastNotification } from "../context/NotificationContext";
import getMonthName from "../hooks/GetMonthName";
import type { STAllCostDTO } from "../dto/STAllCostDTO";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

type op = "day" | "month" | "year"

const BakeryCostStats: React.FC = () => {
    const initialDate = new Date().toISOString().slice(0, 10);
    
    const inicialDay = initialDate
    const initialYear = initialDate.slice(0, 4);
    const initialMonth = initialDate.slice(0, 7);

    const [searchedDate, setSearchedDate] = useState("");

    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [day, setDay] = useState(inicialDay);
    const [opSelected, setOpSelected] = useState<op>("day")
    
    const {addToastNotification: addNotification} = useToastNotification();
    const { bakeryId } = useParams<string>();
    const [stats, setStats] = useState<STAllCostDTO | null>(null);

    const [loadingStats, setLoadingStats] = useState<boolean>(false);

    const getStats = async (startDate: string, endDate: string) => {
        try {
            setLoadingStats(true);
            const response = await api.get(`/statistics/cost/${bakeryId}`,{
                params: {startDate, endDate}
            });
            setStats(response.data);
            
        } catch (err) {
            console.error(err);
            addNotification("Erro na comunicação com o Servidor.", true);
        } finally {
            setLoadingStats(false);
        }
    };

       
    const getLastDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getDateSearched = (date: string) => {
        const dateParts = date.split("-"); 
        setSearchedDate(`${getMonthName(Number(dateParts[1]))} de ${dateParts[0]}`)
        
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (opSelected === "day") {
            getStats(day, day);
            setSearchedDate(day);

        } else if (opSelected === "month") {
            const [y, m] = month.split("-").map(Number);

            const startDate = `${month}-01`;

            const lastDay = getLastDayOfMonth(y, m);
            const endDate = `${month}-${lastDay.toString().padStart(2, "0")}`;
            getStats(startDate, String(endDate));
            getDateSearched(month);

        } else if (opSelected === "year") {
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;
            getStats(startDate, endDate);
            setSearchedDate(year);
        }
    };

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
            <div className="search-container">
                <div className="op-left">
                    <button className={opSelected === "day" ? "selected" : "no-selected"} onClick={() => setOpSelected("day")}>
                        Dia
                    </button>
                    <button className={opSelected === "month" ? "selected" : "no-selected"} onClick={() => setOpSelected("month")}>
                        Mês
                    </button>
                    <button className={opSelected === "year" ? "selected" : "no-selected"} onClick={() => setOpSelected("year")}>
                        Ano
                    </button>
                </div>
                <h2>{searchedDate}</h2>
                <form className="op-right" onSubmit={handleSubmit}>
                    {opSelected === "day" && (
                        <input 
                            className="date"
                            type="date"
                            id="date"
                            max={inicialDay}
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                        />
                    )}
                    
                    {opSelected === "month" && (
                       <input
                            className="month" 
                            type="month"
                            id="month"
                            max={initialMonth}
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        /> 
                    )}
                    
                    {opSelected === "year" && (
                        <input 
                            className="year"
                            type="number"
                            id="year"
                            min={0}
                            max={initialYear}
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    )}
                    
                    
                    <button type="submit" disabled={
                        (opSelected === "day" && !day) ||
                        (opSelected === "month" && !month) ||
                        (opSelected === "year" && !year)
                    }><IoSearch /></button>
                </form>
            </div>
            {loadingStats ? (<div className="spinner"></div>) : (
                <div className="stats-container">
                    <div className="stats1">
                        <h2>Receitas por Produto</h2>
                        <div className="bar-graphic">
                            
                            <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 320, height: 200 } }>
                                <BarChart data={stats?.productCostDTO}>
                                    <CartesianGrid strokeWidth={0.5} vertical={false} />
                                    <XAxis 
                                        dataKey="productName" 
                                        stroke="#F2F4F3"
                                        
                                    />
                                    <YAxis
                                        stroke="#F2F4F3"
                                        tickFormatter={(value) => formatCurrency(value)}
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
                        <div className="best">
                            {stats?.highestCostProduct?
                                (<h3><b>Produto mais vendido:</b>&nbsp;&nbsp;{stats?.highestCostProduct.productName}</h3>)
                                
                                : <h3>Não existem dados sobre este intervalo.</h3>}
                            
                        </div>
                    </div>
                    <div className="stats2">
                        <h2>N.º de Produtos Comprados</h2>
                        <div className="bar-graphic">
                            
                            <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 320, height: 200 } }>
                                <BarChart data={stats?.clientSpendingDTO}>
                                    <CartesianGrid strokeWidth={0.5} vertical={false}/>
                                    <XAxis 
                                        dataKey="clientName" 
                                        stroke="#F2F4F3"
                                        
                                    />
                                    <YAxis
                                        stroke="#F2F4F3"
                                        tickFormatter={(value) => formatCurrency(value)}
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
                                    <Bar dataKey="totalSpent" name={"Gasto total"} fill="#ecac23" radius={[8, 8, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                            
                                
                            
                        </div>
                        <div className="best">
                            {stats?.highestClientSpending?
                                (<h3><b>Melhor Cliente:</b>&nbsp;&nbsp;{stats?.highestClientSpending.clientName}</h3>)
                                
                                : <h3>Não existem dados sobre este intervalo.</h3>}
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default BakeryCostStats