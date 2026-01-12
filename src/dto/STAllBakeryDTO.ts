import type { STCLientSalesDTO } from "./STClientSalesDTO";
import type { STClientSpendingDTO } from "./STClientSpendingDTO";
import type { STMonthlyOrdersDTO } from "./STMonthlyOrdersDTO";
import type { STProductCostDTO } from "./STProductCostDTO";
import type { STProductSalesDTO } from "./STProductSalesDTO";

export interface STAllBakery {
    monthlyOrders: STMonthlyOrdersDTO[],
    productSalesList: STProductSalesDTO[],
    productCostList: STProductCostDTO[],
    topProductSale: STProductSalesDTO,
    topProductCost: STProductCostDTO,
    topClientSale: STCLientSalesDTO,
    topClientSpending: STClientSpendingDTO
}