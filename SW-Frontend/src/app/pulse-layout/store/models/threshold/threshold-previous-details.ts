export interface PreviousRequest {
    requested_date: Date;
    threshold_amount: string;
    transaction_id: string;
    status: string;
    transaction_status: string;
}

export interface ThresholdPreviousDetails {
    pending_transaction: boolean;
    previous_request: PreviousRequest[];
}
