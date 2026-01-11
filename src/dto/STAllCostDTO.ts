import type { STClientSpendingDTO } from "./STClientSpendingDTO";
import type { STProductCostDTO } from "./STProductCostDTO";

export interface STAllCostDTO {
    productCostDTO: STProductCostDTO[],
    highestCostProduct: STProductCostDTO,
    clientSpendingDTO: STClientSpendingDTO[],
    highestClientSpending: STClientSpendingDTO
}