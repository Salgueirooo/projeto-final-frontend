import { useLogout } from "../services/logout";
import { TbLogout } from "react-icons/tb";
import { FaEgg } from "react-icons/fa6";
import "../styles/HomePage.css"
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowCircleRight, FaTasks, FaUser } from "react-icons/fa";
import { MdOutlineCategory, MdOutlineFactory } from "react-icons/md";
import { GiCupcake } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { SettingsTab } from "../hooks/SettingsTab";
import BakerySettings from "../components/SettingsBakeries";
import { IoIosArrowBack, IoMdOptions } from "react-icons/io";
import CategorySettings from "../components/SettingsCategories";
import IngredientSettings from "../components/SettingsIngredients";
import ProductSettings from "../components/SettingsProducts";
import RecipeSettings from "../components/SettingsRecipes";
import UserSettings from "../components/SettingsUsers";
import VariableSettings from "../components/SettingsVariables";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

const Settings: React.FC = () => {
    
    const navigate = useNavigate();

    const { setting } = useParams<{ setting?: SettingsTab }>();

    const selectedTab: SettingsTab = (setting as SettingsTab) || SettingsTab.Bakeries;

    const setSelectedTab = (newTab: SettingsTab) => {
        navigate(`/settings/${newTab}`);
    };

    const [openBar, setOpenBar] = useState(true);

    const haddleLogout = useLogout();

    return (
        <>
            <div className="top-bar">
                <span className="top-short">BakeTec</span>
                <span className="top-long">BakeTec - Sistema de Gestão de Pastelarias</span>
                
                <button className="conf" onClick={() => navigate("/select-bakery")}><IoIosArrowBack /></button>
                
                {openBar ? (
                    <button className="bar-setting-op" onClick={() => setOpenBar(false)}><RxCross2 /></button>
                ) : (
                    <button className="bar-setting-op" onClick={() => setOpenBar(true)}><IoMenu /></button>
                )}
                
                <button className="logout" onClick={haddleLogout}><TbLogout /></button>
            </div>
            <div className="back-home">
                <div className="home-bar">

                    <div className="separators">Pastelarias</div>
                    <button onClick={() => setSelectedTab(SettingsTab.Bakeries)} className={selectedTab === SettingsTab.Bakeries ? "op-selected" : "op"}>
                        <div className="op-left">
                            <MdOutlineFactory />
                            <span className="text">Gerir Pastelarias</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Categorias</div>
                    <button onClick={() => setSelectedTab(SettingsTab.Categories)} className={selectedTab === SettingsTab.Categories ? "op-selected" : "op"}>
                        <div className="op-left">
                            <MdOutlineCategory />
                            <span className="text">Gerir Categorias</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Ingredientes</div>
                    <button onClick={() => setSelectedTab(SettingsTab.Ingredients)} className={selectedTab === SettingsTab.Ingredients ? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaEgg />
                            <span className="text">Gerir Ingredientes</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Produtos</div>
                    <button onClick={() => setSelectedTab(SettingsTab.Products)} className={selectedTab === SettingsTab.Products? "op-selected" : "op"}>
                        <div className="op-left">
                            <GiCupcake />
                            <span className="text">Gerir Produtos</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Receitas</div>
                    <button onClick={() => setSelectedTab(SettingsTab.Recipes)} className={selectedTab === SettingsTab.Recipes ? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaTasks />
                            <span className="text">Gerir Receitas</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Utilizadores</div>
                    <button onClick={() => setSelectedTab(SettingsTab.Users)} className={selectedTab === SettingsTab.Users ? "op-selected" : "op"}>
                        <div className="op-left">
                            <FaUser />
                            <span className="text">Gerir Utilizadores</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>

                    <div className="separators">Variáveis</div>
                    <button onClick={() => setSelectedTab(SettingsTab.Variables)} className={selectedTab === SettingsTab.Variables ? "op-selected" : "op"}>
                        <div className="op-left">
                            <IoMdOptions />
                            <span className="text">Gerir Variáveis</span>
                        </div>
                        <FaArrowCircleRight />
                    </button>
                </div>

                {openBar && (
                    <div className="background-home-bar" onClick={() => setOpenBar(false)}>
                        <div className="home-bar-mobile">

                            <div className="separators">Pastelarias</div>
                            <button onClick={() => setSelectedTab(SettingsTab.Bakeries)} className={selectedTab === SettingsTab.Bakeries ? "op-selected" : "op"}>
                                <div className="op-left">
                                    <MdOutlineFactory />
                                    <span className="text">Gerir Pastelarias</span>
                                </div>
                                <FaArrowCircleRight />
                            </button>

                            <div className="separators">Categorias</div>
                            <button onClick={() => setSelectedTab(SettingsTab.Categories)} className={selectedTab === SettingsTab.Categories ? "op-selected" : "op"}>
                                <div className="op-left">
                                    <MdOutlineCategory />
                                    <span className="text">Gerir Categorias</span>
                                </div>
                                <FaArrowCircleRight />
                            </button>

                            <div className="separators">Ingredientes</div>
                            <button onClick={() => setSelectedTab(SettingsTab.Ingredients)} className={selectedTab === SettingsTab.Ingredients ? "op-selected" : "op"}>
                                <div className="op-left">
                                    <FaEgg />
                                    <span className="text">Gerir Ingredientes</span>
                                </div>
                                <FaArrowCircleRight />
                            </button>

                            <div className="separators">Produtos</div>
                            <button onClick={() => setSelectedTab(SettingsTab.Products)} className={selectedTab === SettingsTab.Products? "op-selected" : "op"}>
                                <div className="op-left">
                                    <GiCupcake />
                                    <span className="text">Gerir Produtos</span>
                                </div>
                                <FaArrowCircleRight />
                            </button>

                            <div className="separators">Receitas</div>
                            <button onClick={() => setSelectedTab(SettingsTab.Recipes)} className={selectedTab === SettingsTab.Recipes ? "op-selected" : "op"}>
                                <div className="op-left">
                                    <FaTasks />
                                    <span className="text">Gerir Receitas</span>
                                </div>
                                <FaArrowCircleRight />
                            </button>

                            <div className="separators">Utilizadores</div>
                            <button onClick={() => setSelectedTab(SettingsTab.Users)} className={selectedTab === SettingsTab.Users ? "op-selected" : "op"}>
                                <div className="op-left">
                                    <FaUser />
                                    <span className="text">Gerir Utilizadores</span>
                                </div>
                                <FaArrowCircleRight />
                            </button>

                            <div className="separators">Variáveis</div>
                            <button onClick={() => setSelectedTab(SettingsTab.Variables)} className={selectedTab === SettingsTab.Variables ? "op-selected" : "op"}>
                                <div className="op-left">
                                    <IoMdOptions />
                                    <span className="text">Gerir Variáveis</span>
                                </div>
                                <FaArrowCircleRight />
                            </button>
                        </div>
                    </div>
                )}

                <div className="home-body">
                    {selectedTab === SettingsTab.Bakeries && <BakerySettings />}
                    {selectedTab === SettingsTab.Categories && <CategorySettings />}
                    {selectedTab === SettingsTab.Ingredients && <IngredientSettings />}
                    {selectedTab === SettingsTab.Products && <ProductSettings />}
                    {selectedTab === SettingsTab.Recipes && <RecipeSettings />}
                    {selectedTab === SettingsTab.Users && <UserSettings />}
                    {selectedTab === SettingsTab.Variables && <VariableSettings />}
                </div>
            </div>
        </>
    )
}

export default Settings;