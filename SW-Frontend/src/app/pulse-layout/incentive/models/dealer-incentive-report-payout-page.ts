export interface PayoutPages {
    result: string[];
}
export interface DownloadPath {
    path: string;
}

export interface PayoutPagesDetails {
    scheme_names_details_list: [
        {
            commission_amount: string,
            commission_name: string,
            eligible_path: string,
            ineligible_path: null
        }
    ],
    overall_incentive: string
}

export interface PayoutPagesDetailRequest {
    commission_name?: string,
    payment_batch_name?: string,
    payout_month_id?: string,
    vendor_id?: string
}

export interface IncentiveReportDetails {
    overall_incentive: string,
    payment_advice_list: [
        {
            created_date: string,
            pay_adv_guid: string,
            amount: string,
            payment_batch_name: string,
            period: string,
            payment_id: string,
            payment_status: string,
            rundate: string,
            sap_id: string,
            scheme_name:string,
        }
    ]
}
