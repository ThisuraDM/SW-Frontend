/**
 * SW device summary model
 */

export interface DeviceSummary {
    daily_data?: DeviceSummaryDetails[]
    monthly_data?: DeviceSummaryDetails[]
}

export interface DeviceSummaryDetails {
    bundle_count: number;
    device_sell_in: number;
    easy_phone_count: number;
    key: string;
    total_count: number;
}

export interface DeviceSellingData {
    month: string;
    sellingCount: number;
}

export interface DeviceSellingBrandData {
    brand: string;
    count: number;
}

export interface DeviceSellingBrandWithColourData {
    brand: string;
    count: number;
    colour: string;
}
