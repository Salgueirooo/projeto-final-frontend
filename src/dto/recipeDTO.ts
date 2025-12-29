import type { recipeIngredientDTO } from "./recipeIngredientDTO";

export interface recipeDTO {
    id: number,
    productId: number,
    productName: string,
    image: string,
    preparation: string,
    nResultingProducts: string,
    ingredients: recipeIngredientDTO[]
}