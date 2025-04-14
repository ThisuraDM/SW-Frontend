export interface DealerStockTransferAcceptRejectRequest {
    action: string;
    approval_user: string;
    stock_request_id: string;
}

export interface RcspStocks {
    totalPages: number,
    totalElements: number,
    content: Array<RcspStockDetails>,
    number: number,
}
export interface RcspStockDetails {
    orderId: string,
    orderNumber: string,
    orderStatus: string,
    outletId: string,
    outletName: string,
    orderDate: string,
    expectedDeliveryDate: string,
    branchName: string,
    storeName: string,
    employeeCode: string,
    employeeName: string,
    orderAmount: number,
    paymentType: string,
    invoiceNumber:string,
    items: Array<RcspStockItems>
}

export interface RcspStockItems {
    itemId: number,
    productName: string,
    productTypeName: string,
    quantity: number,
    promotionItem: boolean,
    unitPrice:number,
    totalAmount:number
}
