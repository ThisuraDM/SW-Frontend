export interface AuditResponse {
    created_by: string;
    last_modified_by: string;
    id: number;
    action: number;
    status: number;
    description: string;
    created_date: string;
    last_modified_date: string;
}

export interface AuditRequest {
    audit_action: string;
    audit_status: string;
    description: string;
}

export enum AuditAction {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    CHANGE_PASSWORD = 'CHANGE_PASSWORD',
    RESET_PASSWORD = 'RESET_PASSWORD',
}

export enum AuditStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}
