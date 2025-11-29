import type { recipeIngredientDTO } from "./recipeIngredientDTO";

export interface recipeDTO {
    id: number,
    productId: number,
    productName: string,
    image: string,
    preparation: string,
    ingredients: recipeIngredientDTO[]
}