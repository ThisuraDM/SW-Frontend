export interface DeviceThresholdDetails {
    device_credit_limit: number;
    available_credit_limit: number;
    utilization: number;
}

export interface DnAStockDetails {
    category: string;
    sap_material_code: string;
    brand: string;
    item_name: string;
    price_per_unit: string;
    min_quantity: string;
    max_quantity: string;
    plant_stock: string;
    available_stock: string;
    request_quantity: string;
    tempQty:any;
}

export interface DnAStockRequest {
    brand: any;
    category: any;
    item_name: any;
    sap_material_code: any;
}

export interface CreditNoteVoucher {
    created_by: string
    created_date: Date
    id: number
    last_modified_by: Date
    last_modified_date: Date
    voucher_name: string
}

export interface CreditNoteReason {
    created_by: string
    created_date: Date
    id: number
    last_modified_by: Date
    last_modified_date: Date
    reason: string
}

export interface PaymentMethod {
    id: number
    payment_method: string
    product_type: string
}

export interface RcspStockItem {
    category: string,
    item_id: number,
    item_name: string,
    last_visitation_purchase: number,
    optimal_proposed_order: number,
    outlet_stocks: number,
    sap_material_code:string,
    tempQty:number
    request_quantity: string;
    price: number;
}
export interface RcspStock {
    content: Array<RcspStockItem>,
    totalPages: number,
    totalElements: number,
    number:number
    numberOfElements:number
}

export interface RcspPromoObject{
    content:Array<RcspPromotions>
}

export interface RcspPromotions {
    dealerGetsDiscount?: string,
    dealerGetsDiscountType?:string,
    promoEndDateTime?:string,
    promoStartDateTime?:string,
    promotionBuyItems:Array<PromotionBuyItems>,
    promotionGetItems:Array<PromotionGetItems>,
    promotionCode?:string
    promotionId?: number,
    promotionName?:string,
    promotionType?:string
    total?:number;
    tax?:number;
    grandTotal?:number;
    paymentType?:string;
    outletId?:string;
}

export interface PromotionBuyItems{
    buyOrGetType?: string,
    id?: number,
    itemCode?: string,
    itemId: number,
    productType?: string,
    qtyOrAmtType?: string,
    quantityOrAmount?: string
}
export interface PromotionGetItems{
    buyOrGetType?: string,
    id?: number,
    itemCode?: string,
    itemId: number,
    productType?: string,
    qtyOrAmtType?: string,
    quantityOrAmount?: string
}

export interface RcspCreateStockRequest{
    order_amount?: string,
    order_type?: string,
    payment_type?: string,
    promotion_id?: number,
    order_items: RcspItems[],
}

export interface RcspItems{
    item_id: number,
    promo_item: boolean,
    quantity: number,
}

export interface RcspCreateStockResponse{
    order_date: string,
    payment_type: string,
    po_number: string,
    request_id: string,
    request_status: string,
    store_id: string,
    store_name: string
}
export interface PromoItemPriceRequest{
    items: PromoItem[]
}

export interface PromoItem {
    itemId?: number,
    productName?: string,
    productTypeName?: string,
    promotionItem?: boolean,
    quantity: number,
    remarks?: string
}




