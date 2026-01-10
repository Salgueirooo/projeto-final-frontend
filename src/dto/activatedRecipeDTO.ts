import type { activatedRecipeIngredientDTO } from "./activatedRecipeIngredientDTO";

export interface activatedRecipeDTO {
    id: number,
    productId: number,
    productName: string,
    productImage: string,
    initialDate: string,
    userName: string,
    preparation: string,
    dose: number,
    nResultingProducts: number,
    ingredientsList: activatedRecipeIngredientDTO[]
}