export interface DealerStockTransferDetailsGetDetails {
    request_id: string;
    status: string;
    origin_outlet_store_id: string;
    origin_outlet_name: string;
    destination_outlet_store_id: string;
    destination_outlet_name: string;
    remarks: string;
    serial_product: boolean;
    create_user: string;
    create_date: string;
    approved_date: string;
    approved_user: string;
    transfer_user: string;
    transfer_date: string;
    stock_details: string;
    summary_details: Array<DealerStockTransferDetailsGetDetailsSummaryDetails>;
    delivery_address: {
        address_type: string;
        city: string;
        house_unit_lot: string;
        post_code: string;
        state: string;
        street_name: string;
        street_type: string;
    },
    updated_date: string;
    grand_total_amount:string;

}

export interface DealerStockTransferDetailsGetDetailsSummaryDetails {
    brand: string;
    category: string;
    sap_material_code: string;
    item_name: string;
    requested_quantity: string;
    approved_quantity: string;
    transfer_quantity: string;
}
