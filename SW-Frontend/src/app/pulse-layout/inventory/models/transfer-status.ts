export interface TransferStatus {
    created_by: string;
    created_date: Date;
    id: number;
    is_active: boolean;
    last_modified_by: string;
    last_modified_date: Date;
    status_name: string;
    dealer_status_name:string;
    is_active_for_dealer:boolean;
}