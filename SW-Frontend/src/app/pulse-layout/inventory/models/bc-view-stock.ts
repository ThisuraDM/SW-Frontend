export interface ProductCategory {
    created_date: Date;
    last_modified_date?: Date;
    id: number;
    lov_key: string;
    value: string;
    display: string;
    group_id: string;
    seq_no: number;
    created_by: string;
    last_modified_by?: string;
}

export interface ProductBrand {
    display: string;
    group_id: string;
    id: number;
    lov_key: string;
    seq_no: number;
    value: string;
}

export interface BCStockSearchRequest {
    brand: string;
    category: string;
    item_name: string;
    material_code: string;
    store_id: string;
}

export interface BCStock {
    rTVQty: string;
    reservedQty: string;
    sAPMaterialCode: string;
    adjustUnavailQty: string;
    brand: string;
    category: string;
    custReservedQty: string;
    inTransitQty: string;
    itemDescription: string;
    pricePerUnit: string;
    stockOnHandQty: string;
    totalAvailableQty: string;
    totalUnAvailableQty: string;
    serial:boolean;
    tempInputQuantity: string; // temp ui property
}

export interface SearchItems {
    itemName: string;
    sapCode: string;
    category: string;
}
