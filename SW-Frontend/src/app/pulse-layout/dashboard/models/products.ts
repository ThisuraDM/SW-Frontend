/**
 * SW products model
 */
export interface Products {
    id: number;
    display_name: string;
}

export interface BlueCubeProducts {
    product_id: number;
    product_name: string;
    plans: string[];
}
