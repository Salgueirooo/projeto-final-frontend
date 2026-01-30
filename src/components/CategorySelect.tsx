import { FaArrowCircleRight } from "react-icons/fa";
import type { CategoryDTO } from "../dto/categoryDTO";
import "../styles/CategorySelect.css"

type opMode = "selectCategory" | "selectProduct";

interface CategorySelectInt {
    category: CategoryDTO,
    onSwitchMode: (mode: opMode) => void;
    onSwitchCategory: (category: CategoryDTO) => void;
}

const CategorySelect: React.FC<CategorySelectInt> = ({category, onSwitchMode, onSwitchCategory}) => {

    return (
        
        <div className="show-category" >
                            
            <div className="category-info" >
                <img src={category.image} alt="Imagem" />
                <h3 title={category.name}>{category.name}</h3>
                
                <button className="select" onClick={() => {
                        onSwitchMode("selectProduct");
                        onSwitchCategory(category);
                    }}>
                    Selecionar&nbsp;&nbsp;<FaArrowCircleRight />
                </button>
            </div>  
        </div> 
    )
}

export default CategorySelect