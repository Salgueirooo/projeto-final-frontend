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
    data: bakeryDTO
}

const SelectBakery: React.FC<BakeryInfoInterface> = ({data}) => {

    const [modalInfo, setModalInfo] = useState<boolean>(false);

    const navigate = useNavigate();

    return (
        <>
            <div className="show-bakery" >
                
                <img src={`${BASE_URL}${data.logo}`} alt="Logotipo" />
                <h3 title={data.name}>{data.name}</h3>
                <div className="bots">
                    <button className="info" onClick={() => setModalInfo(true)}>
                        <FaInfoCircle />&nbsp;Informação
                    </button>
                    <button className="select" onClick={() => navigate("/home", { state: { bakery: data } })}>
                        Selecionar&nbsp;<FaArrowCircleRight />
                    </button>
                </div>
                
                
                
            </div>
            {modalInfo && (
                <BakeryInfo data={data} onSwitch={(b) => setModalInfo(b)}/>
            )}
        </>
    )
}

export default SelectBakery;