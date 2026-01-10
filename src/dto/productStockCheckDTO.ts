export interface ProductStockCheckDTO {
    productId: number,
    productName: string,
    quantityNeeded: number,
    availableQuantity: number,
    sufficient: boolean
}