import { RcspStockItem } from "./dealer-physical-stock-ordering";

export interface DeliveryAddress {
    addressName: string;
    line1: string;
    line2: string;
    postalCode: string;
    city: string;
    state: string;
    stateIdentifier: string;
    country: string;
    isSelected: boolean;
    isMainAddress: boolean;
    isNewAddress: boolean;
    addressId: number;
}

export interface UserInformation {
    id: number,
    email: string;
    login_name: string;
    name: string;
    phone_number: string;
    row_id: string;
    status: string;
}

export interface ExistingContactDetails {
    contact_name: string;
    contact_email: string;
    contact_number: string;
}

export interface DealerConfirmStockOrderDeliveryDetailsRequest {
    address_list: Array<DealerConfirmStockOrderDeliveryDetailsRequestAddress>;
    default_address?: boolean;
    address_id?: number;
    contact_email?: string;
    contact_name?: string;
    contact_number?: string;
    credit_note_reason_id?: string;
    credit_note_voucher_id?: string;
    outlet_id?: string;
    outlet_type?: string;
    payment_method_id?: number;
    payment_option?: string;
    payment_status?: string;
    poid?: string | null;
    product_type_id?: number;
    request_grand_total?: number;
    request_total?: number;
    service_tax?: number;
    stock_order_item_list?: Array<DealerConfirmStockOrderDeliveryDetailsRequestStockOrderItem>;
    stock_order_item_listRcsp?: Array<RcspStockItem>;
}

export interface DealerConfirmStockOrderDeliveryDetailsRequestAddress {
    address_id: number;
    address_name: string;
    address_type: string;
    city: string;
    default_address: boolean;
    house_unit_lot: string;
    post_code: string;
    section: string;
    state: string;
    street_name: string;
    street_type: string;
}

export interface DealerConfirmStockOrderDeliveryDetailsRequestStockOrderItem {
    brand: string;
    category: string;
    device_type_id: string;
    inventory_type_id: string;
    item_name: string;
    price: string;
    quantity: string;
    sap_material_code: string;
    unit_price: number;
}

export interface DealerConfirmStockOrderDeliveryDetailsResponse {
    stock_order_request_id: string;
    stock_order_status: string;
    payment_type: string;
    payment_date: Date;
    request_total: number;
    service_tax: number;
    grand_total: number;
}

export interface AddNewAddressRequest {
    address1: string;
    address2: string;
    city: string;
    country: string;
    name: string;
    post_code: string;
    state: string;
}

export interface DeliveryAddressResponse {
    address_id: number;
    address_line1: string;
    address_line2: string;
    city: string;
    country: string;
    post_code: string;
    reference_name: string;
    state: string;
}
