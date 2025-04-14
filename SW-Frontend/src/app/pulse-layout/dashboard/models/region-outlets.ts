/**
 * SW region outlets model
 */
export interface RegionOutlets {
    region: string,
    outlets: Outlets[],
}

export interface Outlets {
    outlet_id: string,
    outlet_name: string,
    outlet_category: string,
    region: string,
    status: string,
    owner_id: string,
    partner_id: string,
    position: string
}
