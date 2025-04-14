export interface StockRequestSummary {
    request_id: string;
    approved_date: string;
    approved_user: string;
    last_status_updated_date: string;
    status: string;
    origin_outlet_store_id: string;
    origin_outlet_name: string;
    destination_outlet_store_id: string;
    destination_outlet_name: string;
    create_user: string;
    create_date: string;
    transfer_user: string;
    transfer_date: string;
    item_details: Array<ItemDetails>;
    enable_approve_reject: boolean,
    enable_transfer_serial: boolean,
    enable_acknowledge: boolean,
    remarks: string,
    serial_product: string
}

export interface ItemDetails {
    sap_material_code: string;
    category: string;
    brand: string;
    item_name: string;
    requested_quantity:number;
    approved_quantity:number;
    transfer_quantity:number;
    received_quantity:number;
    serial_number:string;
}

export interface PrintDetails {
    fromStoreAddress: string;
    fromStoreId: string;
    fromStoreName: string;
    listOfItems:Array<PrintItems>;
    item_name: string;
    requestDate:string;
    requestId:string;
    requestStatus:string;
    storeId:string;
    storeName:string;
}

export interface PrintItems {
    sapMaterialCode: string;
    category: string;
    brand: string;
    itemName: string;
    quantity:number;
}

export interface RequestSummaryRequest {
    remarks: string;
    storeId: string;
    storeName: string;
    listOfItems: Array<printItem> | any[];
}

export interface printItem {
    acknowledgeQuantity: number;
    itemName: string;
    sapMaterialCode: string;
    transferQuantity: number;
    approvedQuantity: number;
    requestedQuantity: number;
      
}


