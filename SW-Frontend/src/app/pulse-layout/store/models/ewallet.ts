export interface TransferRequest {
    amount: number;
    outlet_id: string;
    payment_method: number;
}

export interface TransferRequestResponse {
    orderId: string;
    paymentMethod: string;
    prePayment: string;
    reconFileName: string;
    responseUrl: string;
    signature: string;
    signature2: string;
    storeId: string;
    totalAmount: string;
    transDate: string;
}

export interface BalanceStatus {
    account_status: string;
    account_name: string;
    account_no: string;
    available_balance: string;
    account_holder_public_name: string;
}

export interface TopUpFormData {
    amount: number;
    outlet_id: string;
    payment_method: number;
}

export interface DealerOwnerResponse {
    id: number;
    login_name: string;
    name: string;
    email: string;
}

export interface PaymentResponse {
    paymentMethod: string;
    outletId: string;
    amount: string;
    orderId: string;
    reasonCode: string;
    reasonCodeType: string;
    signature2: string;
}

export interface PaymentConfirmResponse {
    amount: number;
    id: number;
    initiator: string;
    outlet_id: string;
    payment_gateway_status: number;
    payment_gateway_status_description: string;
    payment_method: number;
    status: number;
    status_check_attempts: number;
    status_updated_at: string;
    transaction_date: string;
}

export interface PinValidationReq {
    pin: string;
}
export interface PinValidationRes {
    reference_number: string;
}

export interface CashoutRequest {
    cashOutRequestDataDTO:CashoutRequestDto
}

export interface CashoutRequestDto {
    amount:number;
    pinNo: string;
    partnerId:string;
}
