import { IoCog, IoSearch, IoSearchCircle } from "react-icons/io5";
import useDecodedToken from "../hooks/hookToken";
import { useLogout } from "../services/logout";
import { TbLogout } from "react-icons/tb";
import { FaBell, FaBoxArchive, FaCakeCandles, FaCartShopping, FaCheck, FaDatabase } from "react-icons/fa6";
import "../styles/HomePage.css"
import type { bakeryDTO } from "../dto/bakeryDTO";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { FaArrowCircleLeft, FaArrowCircleRight, FaCalendarCheck, FaCheckCircle, FaCheckSquare, FaClock, FaRegCalendarCheck, FaSearch } from "react-icons/fa";
import { MdBakeryDining, MdCake, MdHistory, MdIncompleteCircle, MdOutlineCake, MdOutlineEuroSymbol } from "react-icons/md";
import { LuCakeSlice, LuHistory } from "react-icons/lu";
import { BsArchiveFill, BsCake2Fill, BsDatabaseFill, BsDatabaseFillExclamation } from "react-icons/bs";
import { GiCupcake } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { IoIosArchive, IoIosCart, IoIosStats } from "react-icons/io";
import { GoGraph } from "react-icons/go";
import { GrDocumentUser } from "react-icons/gr";
import ProductSearch from "../components/ProductSearch";

interface BakeryInfoInterface {
    data: bakeryDTO
}

const HomePage: React.FC = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [bakery, setBakery] = useState<bakeryDTO | null>(null);

    const haddleLogout = useLogout();
    
    const goBack = () => {
        localStorage.removeItem("selectedBakery");
        navigate("/select-bakery");
    };

    const { decodedToken } = useDecodedToken();
    const isAdmin: boolean = decodedToken?.roles?.includes("ROLE_ADMIN");

    const { addNotification } = useNotification();

    useEffect(() => {
        const bakeryFromState = (location.state as { bakery?: bakeryDTO })?.bakery;

        if (bakeryFromState) {
            setBakery(bakeryFromState);
            localStorage.setItem("selectedBakery", JSON.stringify(bakeryFromState));
        } else {
            const saved = localStorage.getItem("selectedBakery");
            if (saved) setBakery(JSON.parse(saved));
        }
    }, [location.state]);

    const [selected, setSelected] = useState<number>(1);

    return (
        <>
            <div className="top-bar">
                <span className="top-short">BakeTec</span>
                <span className="top-long">BakeTec - Sistema de Gestão de Pastelarias</span>
                {isAdmin && (
                   <button className="conf"><IoCog /></button> 
                )}
                <button className="notifications"><FaBell /></button>
                <button className="logout" onClick={haddleLogout}><TbLogout /></button>
            </div>
            <div className="back-home">
                <div className="home-bar">
                    <button className="home-go-back" onClick={goBack}>
                        <FaArrowCircleLeft />
                        <span className="text" title={bakery?.name}>{bakery?.name}</span>
                    </button>

                    <div className="separators">Produtos</div>
                    
                    <button onClick={() => setSelected(1)} className={selected === 1? "op-selected" : "op"}>
                        <div className="op-left">
                            <GiCupcake />
                            <span className="text">Por categoria</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(2)} className={selected === 2? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Minhas Encomendas</div>

                    <button onClick={() => setSelected(3)} className={selected === 3? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoIosCart />
                            <span className="text">Carrinho</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(4)} className={selected === 4? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaRegCalendarCheck />
                            <span className="text">Confirmadas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(5)} className={selected === 5? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>


                    <div className="separators">Encomendas da Pastelaria</div>

                    <button onClick={() => setSelected(6)} className={selected === 6? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaCheck />
                            <span className="text">Prontas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(7)} className={selected === 7? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaRegCalendarCheck />
                            <span className="text">Confirmadas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(8)} className={selected === 8? "op-selected" : "op"}>
                        <div className="op-left">
                            <LuHistory />
                            <span className="text">Pendentes</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(9)} className={selected === 9? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                    
                    
                    <div className="separators">Receitas</div>
                    
                    <button onClick={() => setSelected(10)} className={selected === 10? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                    
                    <button onClick={() => setSelected(11)} className={selected === 11? "op-selected" : "op"}>
                        <div className="op-left">
                            <MdIncompleteCircle />
                            <span className="text">Iniciadas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(12)} className={selected === 12? "op-selected" : "op"}>
                        <div className="op-left">
                            <BsArchiveFill />
                            <span className="text">Histórico</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>


                    <div className="separators">Stock</div>

                    <button onClick={() => setSelected(13)} className={selected === 13? "op-selected" : "op"}>
                        <div className="op-left">
                            <BsDatabaseFill />
                            <span className="text">Gerir</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(14)} className={selected === 14? "op-selected" : "op"}>
                        <div className="op-left">
                            <BsDatabaseFillExclamation />
                            <span className="text">Ver sem Stock</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Estatísticas</div>

                    <button onClick={() => setSelected(15)} className={selected === 15? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoIosStats />
                            <span className="text">Venda de Produtos</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(16)} className={selected === 16? "op-selected" : "op"}>
                        <div className="op-left">
                            <MdOutlineEuroSymbol />
                            <span className="text">Receitas Adquiridas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(17)} className={selected === 17? "op-selected" : "op"}>
                        <div className="op-left">
                            <GoGraph />
                            <span className="text">N.º Encomendas por Ano</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelected(18)} className={selected === 18? "op-selected" : "op"}>
                        <div className="op-left">
                            <GrDocumentUser />
                            <span className="text">Encomendas do Utilizador</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                </div>
                <div className="home-body">
                    {selected===2 && (<ProductSearch />)}
                    
                </div>
            </div>
        </>
    )
}

export default HomePage;