export interface Content {
    amount: number;
    cnu_date: Date;
    cnu_status: string;
    customer_name: string;
    id: number;
    mobile_no: string;
    order_no: string;
    payment_source: string;
    staff_id: string;
    staff_name: string;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: Sort;
    unpaged: boolean;
}

export interface Sort2 {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface CNUDetails {
    content: Content[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort2;
    totalElements: number;
    totalPages: number;
}
