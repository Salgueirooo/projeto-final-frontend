import { IoCog, IoSearch } from "react-icons/io5";
import useDecodedToken from "../hooks/hookDecodedToken";
import { useLogout } from "../services/logout";
import { TbLogout } from "react-icons/tb";
import { FaBell, FaCheck } from "react-icons/fa6";
import "../styles/HomePage.css"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToastNotification } from "../context/NotificationContext";
import { FaArrowCircleLeft, FaArrowCircleRight, FaRegCalendarCheck } from "react-icons/fa";
import { MdIncompleteCircle, MdOutlineEuroSymbol } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { BsArchiveFill, BsDatabaseFill, BsDatabaseFillExclamation } from "react-icons/bs";
import { GiCupcake } from "react-icons/gi";
import { IoIosCart, IoIosStats } from "react-icons/io";
import { GoGraph } from "react-icons/go";
import { GrDocumentUser } from "react-icons/gr";
import ProductSearch from "../components/ProductSearch";
import CategorySearch from "../components/CategorySearch";
import ShoppingCart from "../components/ShoppingCart";
import SearchMyOrders from "../components/OrdersMySearch";
import FollowMyOrders from "../components/FollowMyOrders";
import SearchOrdersReady from "../components/OrdersReadySearch";
import OrdersPendent from "../components/OrdersPendent";
import SearchOrdersAccepted from "../components/OrdersAcceptedSearch";
import SearchAllOrders from "../components/OrdersSearch";
import ShowRecipes from "../components/RecipeShow";
import { HomeTab } from "../hooks/HomeTab";
import api from "../services/api";
import { useNotificationStore } from "../hooks/hookNotificationStore";
import NotificationWSList from "../components/NotificationWSList";
import ShowActivatedRecipes from "../components/RecipeShowActive";
import RecipeHistory from "../components/RecipeHistory";

const HomePage: React.FC = () => {
    
    const navigate = useNavigate();

    const { bakeryId, tab } = useParams<{ bakeryId: string; tab?: HomeTab }>();

    const selectedTab: HomeTab = (tab as HomeTab) || HomeTab.Products;

    const setSelectedTab = (newTab: HomeTab) => {
        navigate(`/home/${bakeryId}/${newTab}`);
    };

    const haddleLogout = useLogout();
    
    const goBack = () => {
        localStorage.removeItem("selectedBakery");
        navigate("/select-bakery");
    };

    const { decodedToken } = useDecodedToken();
    const isAdmin: boolean = decodedToken?.roles?.includes("ROLE_ADMIN");

    const { addToastNotification: addNotification } = useToastNotification();

    const [bakeryName, setBakeryName] = useState("");

    useEffect (() => {
        const getBakeryName = async () => {
            try {
                
                const response = await api.get(`/bakery/get-name/${bakeryId}`);
                setBakeryName(response.data);
                
                
            } catch (err) {
                console.error(err);
                addNotification("Erro na comunicação com o Servidor.", true);
            }
        };
        getBakeryName();
    }, []);

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

    return (
        <>
            <div className="top-bar">
                <span className="top-short">BakeTec</span>
                <span className="top-long">BakeTec - Sistema de Gestão de Pastelarias</span>
                {isAdmin && (
                   <button className="conf"><IoCog /></button> 
                )}
                <button className={openNotifications ? ("notifications-selected") : ("notifications")} onClick={() => setOpenNotifications(true)}><FaBell /></button>
                {newNotification > 0 && (
                    <div className="new-notif">{newNotification}</div>
                )}
                <button className="logout" onClick={haddleLogout}><TbLogout /></button>
            </div>
            <div className="back-home">
                <div className="home-bar">
                    <button className="home-go-back" onClick={goBack}>
                        <FaArrowCircleLeft />
                        <span className="text" title={bakeryName}>{bakeryName}</span>
                    </button>

                    <div className="separators">Produtos</div>
                    
                    <button onClick={() => setSelectedTab(HomeTab.Products)} className={selectedTab === HomeTab.Products ? "op-selected" : "op"}>
                        <div className="op-left">
                            <GiCupcake />
                            <span className="text">Por categoria</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.SearchProducts)} className={selectedTab === HomeTab.SearchProducts ? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Minhas Encomendas</div>

                    <button onClick={() => setSelectedTab(HomeTab.InCart)} className={selectedTab === HomeTab.InCart ? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoIosCart />
                            <span className="text">Carrinho</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.Accompany)} className={selectedTab === HomeTab.Accompany? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaRegCalendarCheck />
                            <span className="text">Acompanhar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.SearchMyOrders)} className={selectedTab === HomeTab.SearchMyOrders ? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>


                    <div className="separators">Encomendas da Pastelaria</div>

                    <button onClick={() => setSelectedTab(HomeTab.ReadyOrders)} className={selectedTab === HomeTab.ReadyOrders? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaCheck />
                            <span className="text">Prontas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.ConfirmedOrders)} className={selectedTab === HomeTab.ConfirmedOrders ? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaRegCalendarCheck />
                            <span className="text">Confirmadas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.PendentOrders)} className={selectedTab === HomeTab.PendentOrders ? "op-selected" : "op"}>
                        <div className="op-left">
                            <LuHistory />
                            <span className="text">Pendentes</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.SearchAllOrders)} className={selectedTab === HomeTab.SearchAllOrders ? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                    
                    
                    <div className="separators">Receitas</div>
                    
                    <button onClick={() => setSelectedTab(HomeTab.SearchRecipes)} className={selectedTab === HomeTab.SearchRecipes ? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoSearch />
                            <span className="text">Pesquisar</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                    
                    <button onClick={() => setSelectedTab(HomeTab.StartedRecipes)} className={selectedTab === HomeTab.StartedRecipes ? "op-selected" : "op"}>
                        <div className="op-left">
                            <MdIncompleteCircle />
                            <span className="text">Iniciadas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.HistoryRecipes)} className={selectedTab === HomeTab.HistoryRecipes ? "op-selected" : "op"}>
                        <div className="op-left">
                            <BsArchiveFill />
                            <span className="text">Histórico</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>


                    <div className="separators">Stock</div>

                    <button onClick={() => setSelectedTab(HomeTab.ManageStock)} className={selectedTab === HomeTab.ManageStock ? "op-selected" : "op"}>
                        <div className="op-left">
                            <BsDatabaseFill />
                            <span className="text">Gerir</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.WithoutStock)} className={selectedTab === HomeTab.WithoutStock ? "op-selected" : "op"}>
                        <div className="op-left">
                            <BsDatabaseFillExclamation />
                            <span className="text">Ver sem Stock</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Estatísticas</div>

                    <button onClick={() => setSelectedTab(HomeTab.SalesStats)} className={selectedTab === HomeTab.SalesStats ? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoIosStats />
                            <span className="text">Venda de Produtos</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.RevenueStats)} className={selectedTab === HomeTab.RevenueStats ? "op-selected" : "op"}>
                        <div className="op-left">
                            <MdOutlineEuroSymbol />
                            <span className="text">Receitas Adquiridas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.YearStats)} className={selectedTab === HomeTab.YearStats? "op-selected" : "op"}>
                        <div className="op-left">
                            <GoGraph />
                            <span className="text">N.º Encomendas por Ano</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <button onClick={() => setSelectedTab(HomeTab.UserStats)} className={selectedTab === HomeTab.UserStats ? "op-selected" : "op"}>
                        <div className="op-left">
                            <GrDocumentUser />
                            <span className="text">Encomendas do Utilizador</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                </div>
                {openNotifications && (
                    <NotificationWSList mode={"bakery"} onSwitch={(m) => setOpenNotifications(m)} lastAccess={lastAccess} bakeryId={Number(bakeryId)}/>
                )}
                <div className="home-body">
                    {selectedTab === HomeTab.Products && <CategorySearch />}
                    {selectedTab === HomeTab.SearchProducts && <ProductSearch />}
                    {selectedTab === HomeTab.InCart && <ShoppingCart/>}
                    {selectedTab === HomeTab.Accompany && <FollowMyOrders />}
                    {selectedTab === HomeTab.SearchMyOrders && <SearchMyOrders />}
                    {selectedTab === HomeTab.ReadyOrders && <SearchOrdersReady />}
                    {selectedTab === HomeTab.ConfirmedOrders && <SearchOrdersAccepted />}
                    {selectedTab === HomeTab.PendentOrders && <OrdersPendent />}
                    {selectedTab === HomeTab.SearchAllOrders && <SearchAllOrders />}
                    {selectedTab === HomeTab.SearchRecipes && <ShowRecipes />}
                    {selectedTab === HomeTab.StartedRecipes && <ShowActivatedRecipes />}
                    {selectedTab === HomeTab.HistoryRecipes && <RecipeHistory />}
                </div>
            </div>
        </>
    )
}

export default HomePage;