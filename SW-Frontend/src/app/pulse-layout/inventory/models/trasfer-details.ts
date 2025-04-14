
    export interface Content {
        action: string;
        approvalUser: string;
        comments: string;
        createDate: string;
        createUser: string;
        transferFromStoreId: string;
        transferFromStoreName?:string;
        transferId: string;
        transferStatus: string;
        transferStatusId: string;
        transferToStoreId: string;
        transferToStoreName: string;
        navigateOption: NavigationOptions;
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

    export interface TransferDetails {
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

    export enum NavigationOptions {
        SEARCH = 'Search',
        VIEW_DETAILS = 'View Details',
        ACKNOWLEDGE = 'Acknowledge',
        UPDATE = 'Update',
        APPROVE_REJECT = 'Approve/Reject',
        NA = 'N/A',
        VIEW_STOCK_MOVEMENT = 'VIEW_STOCK_MOVEMENT',
        START_APPROVE_REJECT = 'START_APPROVE_REJECT',
        START_APPROVE_REJECT_SUMMARY = 'START_APPROVE_REJECT_SUMMARY',
        START_TRANSFER_STOCK = 'START_TRANSFER_STOCK',
        START_TRANSFER_STOCK_SUMMARY = 'START_TRANSFER_STOCK_SUMMARY',
        ACKNOWLEDGE_TRANSFER_STOCK_SUMMARY = 'ACKNOWLEDGE_TRANSFER_STOCK_SUMMARY',
        START_ACKNOWLEDGE = 'START_ACKNOWLEDGE',
        START_ACKNOWLEDGE_NEW = 'START_ACKNOWLEDGE_NEW',
        RCSP_TRACK_STOCK_DETAILS = 'RCSP_TRACK_STOCK_DETAILS'
    }


