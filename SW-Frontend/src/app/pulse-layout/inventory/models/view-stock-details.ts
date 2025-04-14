
    export interface StockDetails {
        sap_material_code: string;
        store_id: string;
        stock_detail_list: StockDetailList;
    }

    export interface Content {
        serial_number: string;
        service_id?: any;
        expiry_date?: any;
        status: string;
    }

    export interface Sort {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    }

    export interface Pageable {
        sort: Sort;
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    }

    export interface Sort2 {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    }

    export interface StockDetailList {
        content: Content[];
        pageable: Pageable;
        totalPages: number;
        totalElements: number;
        last: boolean;
        size: number;
        number: number;
        sort: Sort2;
        numberOfElements: number;
        first: boolean;
        empty: boolean;
    }


