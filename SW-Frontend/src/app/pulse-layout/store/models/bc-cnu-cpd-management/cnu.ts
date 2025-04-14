export interface Bank {
    created_date?: Date;
    last_modified_date?: Date;
    id: number;
    bank_name: string;
    created_by?: string;
    last_modified_by?: string;
}

export interface PaymentSource {
    created_date?: Date;
    last_modified_date?: Date;
    id: number;
    payment_source_name: string;
    created_by?: string;
    last_modified_by?: string;
}

export interface PaymentMethod {
    created_date?: Date;
    last_modified_date?: Date;
    id: number;
    payment_method_name: string;
    created_by?: string;
    last_modified_by?: string;
}

export interface ReceiptDetailsBank {
    created_by?: string;
    created_date?: Date;
    description: string;
    id: number;
    last_modified_by?: string;
    last_modified_date?: Date;
    receipt_details_bank_name: string;
    status: string;
}

export interface TransactionType {
    id: number;
    transaction_type_name: string;
}

export interface CNUSubmitDetails {
    // step 1 details
    bank_in_to?: Bank;
    source_of_payment?: PaymentSource;
    outlet_store_code_id?: number;
    outlet_name?: string;
    cnu_collection_date?: { year: number, month: number, day: number };
    // step 2 details
    type_of_transaction?: TransactionType;
    customer_name?: string;
    ic_number?: string;
    registered_mobile_number?: string;
    sim_card_number?: string;
    imei_number?: string;
    material_code?: string;
    staff_name?: string;
    // step 3 details
    official_receipt_number?: string;
    official_receipt_amount?: number;
    payment_method?: PaymentMethod;
    cheque_number?: number;
    bank_name?: ReceiptDetailsBank | null;
}

export interface CnuSaveRequest {
    amount: number;
    bank_id: number;
    cheque_bank_id?: number | null; // for the update scenario
    cheque_no: number | null;
    cnu_collection_date: Date;
    customer_name: string;
    ic_number: string;
    imei_number: string;
    material_code: string;
    mobile_number: string;
    outlet_name?: string; // not needed in update scenario
    payment_method_id: number;
    payment_source_id: number;
    receipt_details_bank_id?: number | null; // not needed in update scenario
    receipt_no: string;
    remarks: string;
    sim_number: string;
    staff_name?: string; // not needed in update scenario
    status?: string | null; // not needed in update scenario
    store_code_id?: string; // not needed in update scenario
    transaction_type_id: number;
}

export interface CNUUpdateDetails {
    amount: number;
    bank_id: number;
    cheque_no: number | null;
    cnu_collection_date: Date;
    customer_name: string;
    ic_number: string;
    id: number;
    imei_number: string;
    material_code: string;
    mobile_number: string;
    outlet_name: string;
    payment_method_id: number;
    payment_source_id: number;
    receipt_details_bank_id: number;
    receipt_no: string;
    remark: string;
    sim_number: string;
    staff_name: string;
    store_code_id: string;
    transaction_type_id: number;
}
