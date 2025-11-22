import type { OrderDetailsDTO } from "./orderDetailsDTO";

export interface OrderDTO {
    id: number,
    userName: string,
    phoneNumber: string,
    date: string,
    requestedDate: string,
    orderState: string,
    clientNotes: string,
    staffNotes: string,
    orderDetails: OrderDetailsDTO[]
}