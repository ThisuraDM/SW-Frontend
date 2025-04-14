export interface BcViewStockTransferDetailsBcToBc {
    approved_date: string;
    approved_user: string;
    create_date: string;
    create_user: string;
    destination_outlet_name: string;
    destination_outlet_store_id: string;
    enable_acknowledge: boolean;
    enable_approve_reject: boolean;
    enable_transfer_serial: boolean;
    item_details: Array<StockTransferItemDetails>;
    last_status_updated_date: string;
    last_status_updated_by: string;
    origin_outlet_name: string;
    origin_outlet_store_id: string;
    remarks: string;
    request_id: string;
    serial_product: boolean | null;
    status: string;
    transfer_date: string;
    transfer_user: string;
}

export interface StockTransferItemDetails {
    approved_quantity: string;
    brand: string;
    category: string;
    description: string;
    item_name: string;
    received_quantity: string; // = acknowledge_quantity
    requested_quantity: string;
    available_quantity: string;
    reserved_quantity: string;
    sap_material_code: string;
    serial_number: string;
    serial_numbers: Array<string>;
    transfer_quantity: string;
    added_serial_numbers: Array<string>; // for UI functionality only -> not coming from the backend
    isVerified:boolean;
}

export interface ViewAcknowledgeSummaryList {
    item_name: string;
    serial: string;
}

export interface SearchSerialNumberRequest {
    from_serial: string;
    sap_code: string;
    store_id: string;
    to_serial: string
}

export interface SearchFilterSerialNumberList {
    serial: string;
    selected: boolean;
    newlyAdded:boolean;
}


export interface StockTransferSerialRequest {
    approval_user: string;
    approved_date: string;
    list_of_items: Array<StockTransferItemList>;
    login_user: string;
    transfer_from_store_id: string;
    transfer_to_store_id: string;
}

export interface StockTransferItemList {
    approved_quantity: number;
    item_name: string;
    request_quantity: number;
    sap_material_code: string;
    serial_number_list: Array<string>;
    transfer_quantity: number;
}

export interface BCTrackStockSummaryPrintRequest {
    listOfItems: Array<BCTrackStockSummaryPrintRequestListOfItems>;
    requestId: string;
    storeId: string;
    storeName: string;
}

export interface BCTrackStockSummaryPrintRequestListOfItems {
    itemName: string;
    requestedQuantity: number;
    sapMaterialCode: string;
    transferQuantity: number;
}

export interface ApproveStockTransferRequest {
    list_of_items: ApproveStockTransferRequestItem[] | any[],
    login_user: string;
    remarks: string;
    transfer_from_store_id: string;
    transfer_to_store_id: string;
}

export interface ApproveStockTransferRequestItem {
    approved_quantity: number;
    item_name: string;
    request_quantity: number;
    sap_material_code: string;
}

export interface RejectStockTransferRequest {
    list_of_items: RejectStockTransferRequestItem[],
    login_user: string;
    remarks: string;
    transfer_from_store_id: string;
    transfer_to_store_id: string;
}

export interface RejectStockTransferRequestItem {
    request_quantity: number;
    sap_material_code: string;
}

export interface AcknowledgeStockTransferRequest {
    list_of_item_details_request: AcknowledgeStockTransferRequestItem[];
    approval_user: string;
    approved_at: string;
    destination_outlet: string;
    origin_outlet: string;
    remark: string;
    serial: true;
    ship_user: string;
    transferred_at: string;
    transferred_by: string;
}

export interface AcknowledgeStockTransferRequestItem {
    approved_quantity: string;
    item_name: string;
    received_quantity: string;
    requested_quantity: string;
    sap_material_code: string;
    sequence: string;
    serial_no_list: Array<string>;
    transfer_quantity: string;
}
