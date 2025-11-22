import type { OrderDetailsDTO } from "./orderDetailsDTO";

export interface OrderInCartDTO {
    id: number,
    orderDetailsList: OrderDetailsDTO[]
}