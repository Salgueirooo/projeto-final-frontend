import { RxCross2 } from "react-icons/rx"
import type { bakeryDTO } from "../dto/bakeryDTO"
import "../styles/BakeryInfo.css"

interface BakeryInfo {
    bakery: bakeryDTO,
    onSwitch: (modalInfo: boolean) => void;
}

const BakeryInfo: React.FC<BakeryInfo> = ({bakery, onSwitch}) => {
    return (
        <>
            <div className="back-modal" onClick={() => onSwitch(false)}>
                
                <div className="bakery" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onSwitch(false)}><RxCross2 /></button>
                    
                    <div className="firstLineBakery">
                        <img src={bakery.logo} alt="Logotipo" />
                        
                        <h3>{bakery.name}</h3>
                    </div>

                    <div className="lastLineBakery">
                        <h4><b>Tel.:</b>&nbsp;{bakery.phone_number}</h4>
                        <h4><b>Email:</b>&nbsp;{bakery.email}</h4>
                        <h4><b>Morada:</b>&nbsp;{bakery.address}</h4>  
                    </div>
                </div>
            </div>
        </>
    )
}

export default BakeryInfo;
