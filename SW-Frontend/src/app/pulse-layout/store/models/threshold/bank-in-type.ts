export interface BankInType{
    created_date: Date;
    last_modified_date?: any;
    id: number;
    bank_in_type_name: string;
    is_threshold: boolean;
    is_cnu_cpd: boolean;
    created_by: string;
    last_modified_by?: any;
}