import type { IngredientDTO } from "./ingredientDTO";

export interface IngredientStockCheckDTO {
    ingredient: IngredientDTO,
    quantityNeeded: number,
    availableQuantity: number,
    sufficient: boolean
}