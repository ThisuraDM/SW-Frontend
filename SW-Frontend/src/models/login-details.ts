export interface LoginDetails {
    login_name: string;
    email: string;
    name: string;
    permission: string[];
    outlets: Outlets[];
    user_position:string;
    phone_number?:string;
    status?:string;
    outlet_and_restricted_permissions:RestrictedList[];
}

export interface Outlets {
    region: string;
    outlet_category: string;
    outlet_id: string;
    outlet_name: string;
    main_address?:string;
    outlet_status?:string;
    outlet_type_name?:string;
    owner_id?:string;
}
export interface RestrictedList {
    outlet_id: string;
    restricted_permissions:string[];
}
