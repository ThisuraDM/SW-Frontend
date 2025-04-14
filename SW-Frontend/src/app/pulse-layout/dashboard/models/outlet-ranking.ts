/**
 * SW outlet ranking model
 */
export interface OutletRanking {
    content?: OutletDetails[];
    total_pages: number;
    total_elements: number;
    number_of_elements: number;
    number: number;
    size: number;
}

export interface OutletDetails {
    id?: number;
    outlet_id?: string;
    outlet_name?: string;
    sales?: number;
    target?: number;
    achieved_percentage?: number;
}
