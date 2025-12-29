import type { STCLientSalesDTO } from "./STClientSalesDTO";
import type { STProductSalesDTO } from "./STProductSalesDTO";

export interface STAllSalesDTO {
    productSalesList: STProductSalesDTO[],
    topProductSale: STProductSalesDTO,
    clientSalesList: STCLientSalesDTO[],
    topClientSale: STCLientSalesDTO
}