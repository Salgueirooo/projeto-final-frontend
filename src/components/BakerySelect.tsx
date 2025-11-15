import { FaArrowAltCircleRight, FaArrowCircleRight, FaArrowRight, FaInfoCircle } from "react-icons/fa"
import type { bakeryDTO } from "../dto/bakeryDTO"
import "../styles/SelectBakery.css"
import { IoIosArrowForward } from "react-icons/io"
import { AiFillInfoCircle } from "react-icons/ai"
import { useState } from "react"
import BakeryInfo from "./BakeryInfo"
import { useNavigate } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BakeryInfoInterface {
    bakery: bakeryDTO
}

const SelectBakery: React.FC<BakeryInfoInterface> = ({bakery}) => {

    const [modalInfo, setModalInfo] = useState<boolean>(false);

    const navigate = useNavigate();

    return (
        <>
            <div className="show-bakery" >
                
                <img src={`${BASE_URL}${bakery.logo}`} alt="Logotipo" />
                <h3 title={bakery.name}>{bakery.name}</h3>
                <div className="bots">
                    <button className="info" onClick={() => setModalInfo(true)}>
                        <FaInfoCircle />&nbsp;Informação
                    </button>
                    <button className="select" onClick={() => navigate("/home", { state: { bakery: bakery } })}>
                        Selecionar&nbsp;<FaArrowCircleRight />
                    </button>
                </div>
                
                
                
            </div>
            {modalInfo && (
                <BakeryInfo bakery={bakery} onSwitch={(b) => setModalInfo(b)}/>
            )}
        </>
    )
}

export default SelectBakery;