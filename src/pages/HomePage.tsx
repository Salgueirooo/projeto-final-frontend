import { IoCog, IoSearch, IoSearchCircle } from "react-icons/io5";
import useDecodedToken from "../hooks/hookToken";
import { useLogout } from "../services/logout";
import { TbLogout } from "react-icons/tb";
import { FaBell, FaCakeCandles, FaCartShopping } from "react-icons/fa6";
import "../styles/HomePage.css"
import type { bakeryDTO } from "../dto/bakeryDTO";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { FaArrowCircleLeft, FaArrowCircleRight, FaCheckSquare, FaSearch } from "react-icons/fa";
import { MdBakeryDining, MdCake, MdOutlineCake } from "react-icons/md";
import { LuCakeSlice } from "react-icons/lu";
import { BsCake2Fill } from "react-icons/bs";
import { GiCupcake } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { IoIosCart } from "react-icons/io";

interface BakeryInfoInterface {
    data: bakeryDTO
}

const HomePage: React.FC/*<BakeryInfoInterface>*/ = (/*{ data }*/) => {
    
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
                    
                    <button className="op">
                        <div className="op-left">
                            <IoSearch />
                            <span className="text" key={1}>Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button className="op">
                        <div className="op-left">
                            <GiCupcake />
                            <span className="text" key={2}>Por categoria</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Minhas Encomendas</div>

                    <button className="op">
                        <div className="op-left">
                            <IoIosCart />
                            <span className="text" key={3}>Carrinho</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button className="op">
                        <div className="op-left">
                            <FaCheckSquare />
                            <span className="text" key={4}>Confirmadas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                </div>
                <div className="home-body">
                    
                </div>
            </div>
        </>
    )
}

export default HomePage;