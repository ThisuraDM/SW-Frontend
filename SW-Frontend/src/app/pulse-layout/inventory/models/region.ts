export interface OutletList {
    store_id: string;
    store_name: string;
    category_name: string;
}

export interface Regions {
    region_name: string;
    outlet_list: OutletList[];
}
