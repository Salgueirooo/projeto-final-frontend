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
    HistoryRecipes: "history-recipes",
    ManageStock: "manage-stock",
    WithoutStock: "without-stock",
    SalesStats: "sales-stats",
    RevenueStats: "revenue-stats",
    YearStats: "year-stats",
    UserStats: "user-stats",
} as const;

export type HomeTab = typeof HomeTab[keyof typeof HomeTab];