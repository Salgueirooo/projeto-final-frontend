import type { OrderDTO } from "../dto/orderDTO";
import { getStringDay } from "./hookStringDay";
import { getTodayDate } from "./hookTodayDate";

export const groupOrdersByDay = (orders: OrderDTO[]) => {
    return orders.reduce((groups: Record<string, OrderDTO[]>, order) => {
        const date = new Date(order.date);
        const todayDate = getTodayDate();
        const day = date.toISOString().split("T")[0];

        if (!groups[getStringDay(day, todayDate)]) groups[getStringDay(day, todayDate)] = [];
        groups[getStringDay(day, todayDate)].push(order);

        return groups;
    }, {});
};