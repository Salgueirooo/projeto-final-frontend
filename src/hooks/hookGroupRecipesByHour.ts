import type { producedRecipeDTO } from "../dto/producedRecipeDTO";

export const groupRecipesByHour = (recipes: producedRecipeDTO[]) => {
    return recipes.reduce((groups: Record<string, producedRecipeDTO[]>, recipe) => {
        const date = new Date(recipe.initialDate);
        const hour = date.getHours().toString().padStart(2, "0") + ":00";

        if (!groups[hour]) groups[hour] = [];
        groups[hour].push(recipe);

        return groups;
    }, {});
};