/**
 * SW historical performance model
 */
export interface ProductPerformance {
    daily_data?: ProductPerformanceDetail[]
    monthly_data?: ProductPerformanceDetail[]
}

export interface ProductPerformanceDetail {
    key: string
    sales: number
}
