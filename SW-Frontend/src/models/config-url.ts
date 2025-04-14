export interface UrlConfig {
    b2c_redirect:string;
    payment_gateway:string;
    ad_redirect:string;
    ad_ms_clientId:string;
    ad_ms_authority:string;
    base_url:string;
    disable_dealer_login: boolean;
    disable_redirect: boolean;
    is_sudden_downtime: boolean;
    is_planned_maintenance:boolean;
    maintenance_start_time:string;
    maintenance_end_time:string;
}

