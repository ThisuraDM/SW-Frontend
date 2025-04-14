import {NavigationOptions} from '@app/SW-layout/inventory/models/trasfer-details';

export interface Content {
        action: string;
        dateCreated: string;
        lastUpdatedDate: string;
        payType: string;
        paymentTermId: string;
        requestStoreId: string;
        salesOrderNo: string;
        stockRequestId: string;
        stockRequestStatus: string;
        navigateOption: NavigationOptions;
        stockOrderRequestId:string;
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

    export interface DealerStockTransferDetails {
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

