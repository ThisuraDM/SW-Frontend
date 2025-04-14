export interface ChangePasswordResponse {}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface PasswordPolicyResponse {
    identifier: string;
    regex: string;
    description: string;
    enabled: boolean;
    isValidated: boolean;
}
