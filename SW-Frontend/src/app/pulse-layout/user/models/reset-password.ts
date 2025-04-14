export interface ResetPasswordUserListResponse {
    user_id: string;
    user_name: string;
    last_reset_date: string;
    last_login_date: string;
    isSelected: boolean;
    outlet_id: string;
}

export interface ResetPasswordUserListRequest {}
