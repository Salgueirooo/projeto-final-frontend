export const SettingsTab = {
    Bakeries: "bakeries",
    Categories: "categories",
    Ingredients: "ingredients",
    Products: "products",
    Recipes: "recipes",
    Users: "users",
    Variables: "variables"
} as const;

export type SettingsTab = typeof SettingsTab[keyof typeof SettingsTab];