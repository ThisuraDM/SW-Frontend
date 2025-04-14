export interface PayoutPerformanceSummaryDetails {
    result: [
        {
            commissionName: string,
            commissionAmount: number,
            eligibleCount: number,
            grossCount: number,
            ineligibleCount: number
        },
    ]
}
export interface PayoutSummaryDetailsPlans {
    summary_by_plan_name: [
        {
            package_plan: string,
            eligible: string,
            amount_per_line: string,
            total_incentive: string,
        }
    ];
}

export interface PayoutPerformanceSummaryDetailsRequest {
    category: string,
    payout_month_id: string,
    vendor_id: string,
}

export interface PayoutTrendSchemaNames {
    schema_names:string[]
}

export interface PayoutTrendCategoryNames {
    result:string[]
}

export interface PayoutTrendChartResponse {
    month:string,
    commission_amount:string,
}

