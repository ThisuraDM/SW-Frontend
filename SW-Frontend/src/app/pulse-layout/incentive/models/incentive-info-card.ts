export interface IncentiveInfoCard {
    total_incentive_payout: number,
    donut_details: IncentiveInfoCardDonuts[]
}

export interface IncentiveInfoCardDonuts {
    category_code: string,
    category: string,
    commission_amount: number,
    eligible_count: number,
    gross_count: number,
    ineligible_count: number,
}

export interface SWIncentiveData {
    category?: string;
    payout_month_id?: string;
    vendor_id?: string;
    month_label?: string;
    payment_batch_name?: string;
    scheme_name?:string;
}
