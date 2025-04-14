export interface DeviceThreshold {
    available_threshold: number;
    device_security_deposit: number;
    device_top_up_security: number;
    enable_withdraw: boolean;
    excess_threshold: number;
    outlet_id: string;
    payment_due_amount: number;
    total_device_threshold_limit: number;
    utilized_threshold: number;
    virtual_account: string
    sap_customer_code: string
}

export interface DeviceThresholdWithdrawalRequest {
    approved_amount: string;
    id: string;
    ins_area: string;
    name: string;
    operation: string;
    outlet_id: string;
    owner: string;
    payment_amount: string;
    payment_type: string;
    reference: string;
    reference_id: string;
    remarks: string;
    status: string;
    transaction_id: string;
    transaction_type: string;
    tt_source: string;
    type: string
    cust_code: string
}

export interface DeviceThresholdWithdrawalResponse {
    account_id: string;
    available_threshold: string;
    SW_customer_code: string;
    SW_sap_id: string;
    excess_threshold: string;
    status: string;
    payment_amount: string;
    transaction_id: string
}
