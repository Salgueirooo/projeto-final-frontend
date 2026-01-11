export const HomeTab = {
    Products: "products",
    SearchProducts: "search-products",
    InCart: "in-cart",
    Accompany: "accompany",
    SearchMyOrders: "search-my-orders",
    ReadyOrders: "ready-orders",
    ConfirmedOrders: "confirmed-orders",
    PendentOrders: "pendent-orders",
    SearchAllOrders: "search-all-orders",
    SearchRecipes: "search-recipes",
    StartedRecipes: "started-recipes",
    TaskListRecipes: "recipes-to-do",
    HistoryRecipes: "history-recipes",
    ManageProductStock: "manage-products-stock",
    ManageIngredientStock: "manage-ingredients-stock",
    VerifyStock: "verify-stock",
    SalesStats: "sales-stats",
    RevenueStats: "revenue-stats",
    UserStats: "user-stats",
} as const;

export type HomeTab = typeof HomeTab[keyof typeof HomeTab];