import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { HandleError, HttpErrorHandler } from './../../../../services/http-error-handler.service';
import { HistoryDetail, UnlockRequest, UnlockResponse, UnlockSummary, VoucherInfo } from '../models/voucher-info';
import { catchError } from 'rxjs/operators';
import { Paginate } from '../../../../models/paginate';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class ReinstateRechargeCardService {

    private readonly handleError: HandleError;
    private reinstateBaseUrl = `${environment.baseUrl}/outlet/inventory/reinstated-recharge-card`;
    private reinstateUnlockReasonUrl = `${environment.baseUrl}/outlet/inventory/reinstated-recharge-card/unlock_reasons`;

    constructor(
        private http: HttpClient,
        private httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Satisfaction Survey Service');
    }

    getUserReinstateCardDetails(outletId: string | null, serialNo: any, userId: string): Observable<VoucherInfo> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .get<VoucherInfo>(`${this.reinstateBaseUrl}/${outletId}?serial_number=${serialNo}`, httpOptions);
    }

    getUnLockRechargeCardHistory(outletId: string | null, serialNumber: string,  fromDate: string, toDate: string, page: number, limit: number, userId: string): Observable<Paginate<HistoryDetail>> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .get<Paginate<HistoryDetail>>(`${this.reinstateBaseUrl}/${outletId}/unlock_history?serial_number=${serialNumber}&from_date=${fromDate}&to_date=${toDate}&page=${page}&limit=${limit}`, httpOptions);
    }

    getUserReinstateCardUnlockReasons(): Observable<string[]> {
        return this.http
            .get<string[]>(`${this.reinstateUnlockReasonUrl}`, httpOptions)
            .pipe(catchError(this.handleError<string[]>('getUserReinstateCardUnlockReasons')));
    }

    unlockRechargeCard(outletId: string | null, unlockRequest: UnlockRequest, userId: string): Observable<UnlockResponse> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http.post<UnlockResponse>(`${this.reinstateBaseUrl}/${outletId}`, unlockRequest, httpOptions);
    }

    getRechargeCardUnlockSummary(outletId: string | null, transactionId: string,  id: number, userId: string): Observable<UnlockSummary> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .get<UnlockSummary>(`${this.reinstateBaseUrl}/${outletId}/unlock_summary?id=${id}&transaction_id=${transactionId}`, httpOptions);
    }

    unlockSummaryDetailDownload(outletId: string, transactionId: string, serialNo: string, id: number, userId: string) {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .get(`${this.reinstateBaseUrl}/${outletId}/unlock_summary/download?id=${id}&transaction_id=${transactionId}&serial_number=${serialNo}`, {
                observe: 'response',
                responseType: 'blob',
            });
    }
}
