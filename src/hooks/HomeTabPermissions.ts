export type Role = "ROLE_ADMIN" | "ROLE_CONFECTIONER" | "ROLE_COUNTER_EMPLOYEE" | "ROLE_CLIENT";

export const HomeTabsPermissions: Record<string, Role> = {
    products: "ROLE_CLIENT",
    "search-products": "ROLE_CLIENT",

    "in-cart": "ROLE_CLIENT",
    accompany: "ROLE_CLIENT",
    "search-my-orders": "ROLE_CLIENT",

    "ready-orders": "ROLE_COUNTER_EMPLOYEE",
    "confirmed-orders": "ROLE_COUNTER_EMPLOYEE",
    "pendent-orders": "ROLE_ADMIN",
    "search-all-orders": "ROLE_COUNTER_EMPLOYEE",

    "search-recipes": "ROLE_CONFECTIONER",
    "started-recipes": "ROLE_CONFECTIONER",
    "recipes-to-do": "ROLE_CONFECTIONER",
    "history-recipes": "ROLE_CONFECTIONER",

    "manage-products-stock": "ROLE_CONFECTIONER",
    "manage-ingredients-stock": "ROLE_CONFECTIONER",
    "verify-stock": "ROLE_ADMIN",

    "sales-stats": "ROLE_ADMIN",
    "revenue-stats": "ROLE_ADMIN",
    "user-stats": "ROLE_CLIENT"
};

export type HomeTabsPermissions = typeof HomeTabsPermissions[keyof typeof HomeTabsPermissions];