import type { recipeIngredientDTO } from "./recipeIngredientDTO";

export interface ingredientStockCheckDTO {
    ingredient: recipeIngredientDTO,
    availableQuantity: number,
    sufficient: boolean
}