
export const getStringDay = (dateSearched: string, todayDate: string) => {
    const parseDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    const selected = parseDate(dateSearched);

    const today = parseDate(todayDate);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (selected.getTime() === today.getTime()) {
        return "Hoje";
    } else if (selected.getTime() === yesterday.getTime()) {
        return "Ontem";
    } else if (selected.getTime() === tomorrow.getTime()) {
        return "Amanhã";
    }

    return dateSearched;
    
}