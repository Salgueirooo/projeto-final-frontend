import { FaArrowCircleRight, FaInfoCircle } from "react-icons/fa"
import type { bakeryDTO } from "../dto/bakeryDTO"
import "../styles/SelectBakery.css"
import { useState } from "react"
import BakeryInfo from "./BakeryInfo"
import { useNavigate } from "react-router-dom"
import { HomeTab } from "../hooks/HomeTab"

interface BakeryInfoInterface {
    bakery: bakeryDTO
}

const SelectBakery: React.FC<BakeryInfoInterface> = ({bakery}) => {

    const [modalInfo, setModalInfo] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <>
            <div className="show-bakery" >
                
                <img src={bakery.logo} alt="Logotipo" />
                <h3 title={bakery.name}>{bakery.name}</h3>
                
                <div className="bots">
                    <button className="info" onClick={() => setModalInfo(true)}>
                        <FaInfoCircle />&nbsp;Informação
                    </button>
                    <button className="select" onClick={() => navigate(`/home/${bakery.id}/${HomeTab.Products}`)}>
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