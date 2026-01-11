import type { STClientSpendingDTO } from "./STClientSpendingDTO";
import type { STMonthlyOrdersDTO } from "./STMonthlyOrdersDTO";
import type { STProductSalesDTO } from "./STProductSalesDTO";

export interface STUserDTO {
    monthlyOrders: STMonthlyOrdersDTO[],
    top10Products: STProductSalesDTO[],
    totalSpent: STClientSpendingDTO
}