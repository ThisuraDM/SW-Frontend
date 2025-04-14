export interface Warehouses {
    id: number;
    code: string;
    name: string;
    is_active:boolean;
}

export interface InventoryItemsRequest{
    sap_material_code: string;
    store_id: string;
    category:string;
    return_to: string;
}
export interface InventoryItems{
    brand:string;
    category:string;
    itemDescription:string;
    sAPMaterialCode:string;
    totalAvailableQty:number;
    serial:boolean;
    serialNo:string;
    status:string;
}
export interface ConfirmReturn{
    listOfItems : Array<ReturnItemList>;
    requestDate: string;
    requestId: string;
    requestStatus: string;
    storeId: string;
    storeName: string;
}

export interface ReturnItemList{
    brand: string;
    category: string;
    itemName: string;
    quantity: number;
    sapMaterialCode: string;
    serial:boolean;
    serialNo:string;
}

export interface RequestSummaryReturnItemList{
    brand: string;
    category: string;
    itemName: string;
    quantity: number;
    sapMaterialCode: string;
}

export interface ConfirmReturnForAPI{
    return_item_list : Array<ReturnItemListForAPI>;
    comments: string | null;
    created_by: string;
    serial: boolean;
    transfer_from_store_id: string;
    transfer_to_store_id: string;
}

export interface ReturnItemListForAPI{
    item_name: string;
    sap_material_code: string;
    transfer_quantity: number;
    transfer_to_store_id: string;
    list_of_uinrange: Array<SerialList>;
}

export interface SerialList{
    uin_start: string;
    uin_end:string;
}

export interface StockReturnRequestSummaryRequest {
    requestDate: string;
    requestId: string;
    requestStatus: string;
    storeId: string;
    storeName: string
    listOfItems:  Array<RequestSummaryReturnItemList>
}

