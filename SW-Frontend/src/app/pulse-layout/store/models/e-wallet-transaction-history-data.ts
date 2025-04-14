export interface EWalletTransactionHistoryData {
    transaction_list_data: {
        transaction_item: EWalletTransactionItem[];
        number_of_returned: string;
        number_of_total: string;
    };
    bo_completed_time: string;
}

export interface EWalletTransactionItem {
    amount: string;
    transactionStatus: string;
    completedTime: string;
    initiatedTime: string;
    initiatorName: string;
    txnType: string;
    currency: string;
    receiptNumber: string;
    details:string;
    markedHighlighted:boolean;
}

export interface EWalletTransactionRequest {
    end_date_time: string;
    outlet_id: string;
    start_date_time: string;
    email_required: boolean;
}

export interface EWalletTransactionResponse {
    cashOutTransaction:EWalletCashoutTransactionItem
}
export interface EWalletCashoutTransactionItem {
    amount: number,
    bank_acc_no: string,
    bank_name: string,
    id: number,
    outlet_id: string,
    partner_id: string,
    ref_no: string,
    request_no: string,
    response_status: number,
    status: string,
    status_description: string,
    transaction_date: string
}

export interface EWalletTransactionResponse {
    content: Array<EWalletCashoutTransactionItem>;
    totalElements: number;
    totalPages: number;
    numberOfElements:number;
}

export interface CashoutStatus {
    displayName:string,
    value:string

}