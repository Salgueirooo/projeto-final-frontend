import { RxCross2 } from "react-icons/rx"
import type { bakeryDTO } from "../dto/bakeryDTO"
import "../styles/BakeryInfo.css"
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BakeryInfo {
    data: bakeryDTO,
    onSwitch: (modalInfo: boolean) => void;
}

const BakeryInfo: React.FC<BakeryInfo> = ({data, onSwitch}) => {


    return (
        <>
            <div className="back-modal" onClick={() => onSwitch(false)}>
                
                <div className="bakery" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onSwitch(false)}><RxCross2 /></button>
                    
                    
                        <div className="firstLine">
                            <img src={`${BASE_URL}${data.logo}`} alt="Logotipo" />
                            <div className="container">
                                <h3>{data.name}</h3>
                            </div>
                            
                            
                        </div>
                        <div className="lastLine">
                            
                            <h4><b>Tel.:</b> {data.phone_number}</h4>
                            <h4><b>Email:</b> {data.email}</h4>
                            <h4><b>Morada:</b> {data.address}</h4>
                            
                            
                        </div>
                    
                    
                
                </div>
            </div>
            
        </>
    )
}

export default BakeryInfo;
