export interface TransactionHistoryRequest {
    end_date_time: string;
    search_by: string;
    search_value: string;
    start_date_time: string;
    transaction_type_id: number;
}

export interface TransactionHistoryResponse {
    content: TransactionHistory[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        unpaged: boolean;
    };
    size: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}

export interface TransactionHistory {
    amount: number;
    date: string;
    mobile_number: string;
    name: string;
    order_id: string;
    receipt_id: number;
    transaction_type: string;

}
