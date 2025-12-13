import type { activatedRecipeIngredientDTO } from "./activatedRecipeIngredientDTO";

export interface activatedRecipeDTO {
    id: number,
    productName: string,
    productImage: string,
    initialDate: string,
    userName: string,
    preparation: string,
    dose: number,
    ingredientsList: activatedRecipeIngredientDTO[]
}