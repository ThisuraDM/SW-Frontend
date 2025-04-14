/**
 * SW trend model
 */
export interface DailyTrend {
    product_name: string,
    sales: number,
    target: number,
    variance: number,
    required_rate: number
}