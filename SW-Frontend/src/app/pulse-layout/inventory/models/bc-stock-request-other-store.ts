export interface ConfirmStocks {
    comments: string | null;
    created_by: string;
    serial: boolean;
    transfer_from_store_id: string;
    transfer_item_list: Array<TransferItemList>;
    transfer_to_store_id: string;
}

export interface TransferItemList {
    item_name: string;
    sap_material_code: string;
    transfer_quantity: number;
    transfer_to_store_id: string;
}
