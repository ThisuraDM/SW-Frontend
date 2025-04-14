export interface VoucherInfo {
    voucherInfo: VoucherInfoDetails;
}

export interface VoucherInfoDetails {
    batchId: string,
    serialNo: string,
    faceValue: number,
    currency: number,
    cardStartDate: number,
    cardStopDate: number,
    hotCardFlag: number,
    cardCosId: number,
    cardCosName: string
    status: string,
    lockedDate:string
}

export interface UnlockRequest {
    operationReason: string,
    startSerialNo: string
}

export interface UnlockResponse {
    id: number,
    denomination: string,
    operationReason: string,
    rechargeCardExpDate: string,
    rechargeCardStatus: string,
    serialNo: string,
    transactionId: string,
    transactionStatus: string
}

export interface HistoryDetail {
    id: number,
    cardExpDate: string,
    createdDate: string,
    denomination: string,
    outletId: string,
    serialNo: string,
    transactionId: string,
    unlockReason: string,
    userId: string
}

export interface UnlockSummary {
    denomination: string,
    id: number,
    operationReason: string,
    outletId: string,
    rechargeCardExpDate: string,
    rechargeCardStatus: string,
    serialNo: string,
    transactionId: string,
    transactionStatus: string,
    unlockDateTime: string,
    userId: string
}
