import type { OrderDTO } from "../dto/orderDTO";

export const groupOrdersByHour = (orders: OrderDTO[]) => {
    return orders.reduce((groups: Record<string, OrderDTO[]>, order) => {
        const date = new Date(order.date);
        const hour = date.getHours().toString().padStart(2, "0") + ":00";

        if (!groups[hour]) groups[hour] = [];
        groups[hour].push(order);

        return groups;
    }, {});
};