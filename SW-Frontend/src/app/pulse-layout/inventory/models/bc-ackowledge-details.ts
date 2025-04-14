
export interface StockDetail {
    approved_quantity: string;
    item_name: string;
    requested_quantity: string;
    sap_material_code: string;
    serial_number: string;
    transfer_quantity: string;
    checked: boolean;
    received_quantity: 0;
}

export interface SummaryDetail {
    approved_quantity: number;
    item_name: string;
    requested_quantity: string;
    sap_material_code: string;
    transfer_quantity: string;
}

export interface AcknowledgeDetails {
    approved_date: string;
    approved_user: string;
    create_date: string;
    create_user: string;
    destination_outlet_name: string;
    destination_outlet_store_id: string;
    origin_outlet_name: string;
    origin_outlet_store_id: string;
    remarks: string;
    request_id: string;
    serial_product: boolean;
    stock_details: StockDetail[];
    summary_details: SummaryDetail[];
    transfer_date: string;
    transfer_user: string;
}

export interface UnmatchedItems {
    label: string;
    itemCode: string;
}

export interface AcknowlegeSaveRequest {
    approval_user?: string;
    approved_at?: string; 
    destination_outlet?: string;
    list_of_item_details_request: AcknowledgeSaveItemType[];
    origin_outlet?: string; 
    remark: string; 
    serial?: boolean; 
    ship_user?: string | null; 
    transferred_at?: string; 
    transferred_by?: string;
}

export interface AcknowledgeSaveItemType { 
    approved_quantity: string; 
    item_name: string; 
    received_quantity: string; 
    requested_quantity: string; 
    sap_material_code: string; 
    sequence: string | null; 
    serial_no_list: string[]; 
    transfer_quantity: string; 
}
export interface AcknowledgeDownloadSummaryResponse {
    description: "string",
    filename: "string",
    inputStream: {},
    open: true,
    readable: true,
    uri: "string",
    url: "string"
}

