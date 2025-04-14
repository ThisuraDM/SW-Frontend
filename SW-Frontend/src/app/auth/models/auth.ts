export interface LoginInput {
    username: string;
    password: string;
    user_type: 'internal' | 'external'
}

export interface LoginSuccess {
    login_session_id: string;
    mobile_number: string
}

export interface LoginError {
    code: number;
    errorMessage: string
}

export interface OTPRespond {
    login_session_id: string;
    mobile_number: string;
}
export interface ValidateOTPRequest {
    otp_value: string;
}

export interface ValidateOTPResponse {
    id_token:string;
    expires_in: any;
    token_type:string;
}

export interface OTPRequestEwallet {
    deliver_to: string;
    delivery_method: string;
}
export interface OTPResponseEwallet {
    security_code: string;
    session_id: string;
    message: string;
    otp: string;
}

export interface ValidateOTPRequestEwallet {
    otp: string;
    security_code: string;
    session_id: string;
}

export interface ValidateOTPResponseEwallet {
}
