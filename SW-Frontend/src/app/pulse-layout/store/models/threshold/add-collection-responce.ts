 export interface BankInType {
        created_date: Date;
        last_modified_date?: any;
        id: number;
        bank_in_type_name: string;
        is_threshold: boolean;
        is_cnu_cpd: boolean;
        created_by: string;
        last_modified_by?: any;
    }

    export interface ReferenceId {
        created_date: Date;
        last_modified_date?: any;
        id: number;
        reference_id_name: string;
        created_by: string;
        last_modified_by?: any;
    }

    export interface PaymentChannel {
        created_date: Date;
        last_modified_date?: any;
        id: number;
        payment_channel_name: string;
        created_by: string;
        last_modified_by?: any;
    }

    export interface ThresholdCollectionHeader {
        created_date: Date;
        last_modified_date: Date;
        id: number;
        store_code_id: string;
        total_amount_cash: number;
        total_amount_cheque: number;
        total_amount_credit_card: number;
        total_amount_boost: number;
        total_amount: number;
        status: string;
        transaction_id: string;
        requested_date: Date;
        approval_status: string;
        transaction_status: string;
        created_by: string;
        last_modified_by: string;
    }

    export interface AddCollectionResponce {
        created_date: Date;
        last_modified_date: Date;
        id: number;
        bank_in_amount: number;
        bank_in_time: Date;
        attachment_path?: any;
        bank_in_type: BankInType;
        reference_id: ReferenceId;
        payment_channel: PaymentChannel;
        threshold_collection_header: ThresholdCollectionHeader;
        created_by: string;
        last_modified_by?: any;
        deleted: boolean;
    }

