export interface EWalletTransactionHistoryDownloadRequest {
    company_name: string;
    company_number: string;
    date: string;
    email: string;
    email_required: boolean;
    end_date_time: string;
    msisdn: string;
    requested_by: string;
    start_date_time: string;
    transaction_type: string;
}
