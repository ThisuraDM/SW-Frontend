import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EWalletTransactionHistoryDownloadRequest } from '@app/SW-layout/store/models/e-wallet-transaction-history-download-request';
import { DealerOwnerResponse } from '@app/SW-layout/store/models/ewallet';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import {
    EWalletTransactionHistoryData,
    EWalletTransactionItem,
    EWalletTransactionRequest,
    EWalletTransactionResponse,
} from '../models/e-wallet-transaction-history-data';

/**
 * SW e wallet transaction history service
 * Author: Thilina Kelum
 * Created Date: 2021 October 10
 */
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class EWalletTransactionHistoryService {
    baseUrl = `${environment.baseUrl}`;
    prefix = `/ewallet/`;
    baseurlCashOutHistory = `${environment.baseUrl}/ewallet/`;
    baseurlCashOutHistoryDownload = `${environment.baseUrl}/ewallet/`;
    baseurlCashOutHistoryPrintReciept = `${environment.baseUrl}/ewallet/`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('SW e-wallet Service');
    }

    /** GET Transaction History from the server */
    getEWalletTransactionHistory(
        request: EWalletTransactionRequest,
        outletId: string
    ): Observable<Array<EWalletTransactionItem>> {
        return this.http
            .post<Array<EWalletTransactionItem>>(this.baseUrl + this.prefix + 'transactions-query/' + outletId, request, httpOptions);
    }

    /** GET Transaction History PDF from the server */
    getEWalletTransactionPDF(
        request: EWalletTransactionHistoryDownloadRequest,
        outletId: string
    ): Observable<EWalletTransactionHistoryDownloadRequest> {
        const httpOptions = {
            responseType: 'blob' as 'json',
        };

        return this.http
            .post<EWalletTransactionHistoryDownloadRequest>(
                this.baseUrl + this.prefix + 'transactions-download/' + outletId,
                request,
                httpOptions
            )
            .pipe(
                catchError(
                    this.handleError<EWalletTransactionHistoryDownloadRequest>(
                        'transactions history download'
                    )
                )
            );
    }

    getDealerOwnerEmail(outletId: string): Observable<DealerOwnerResponse> {
        return this.http
            .get<DealerOwnerResponse>(
                this.baseUrl + '/dealer-outlet/' + outletId + '/dealer-owner',
                httpOptions
            )
            .pipe(catchError(this.handleError<DealerOwnerResponse>('getDealerOwnerEmail')));
    }

    getEwalletCashoutHistory(partner_id: string, start_date_time:string, end_date_time:string, status:string, page:number)
    : Observable<EWalletTransactionResponse> {
        return this.http
            .get<EWalletTransactionResponse>(
                `${this.baseurlCashOutHistory}${partner_id}/cash-out-transactions?from_date=${start_date_time}&limit=10&page=${page}&status=${status}&to_date=${end_date_time}`,
                httpOptions
            )
            .pipe(catchError(this.handleError<EWalletTransactionResponse>('getEwalletCashoutHistory')));
    }

    downloadCashoutHistory(partner_id: string, start_date_time:string, end_date_time:string, status:string): Observable<any> {
        return this.http
            .get<BlobPart>(`${this.baseurlCashOutHistoryDownload}/${partner_id}/cash-out-transactions/download?from_date=${start_date_time}&status=${status}&to_date=${end_date_time}`,
                { responseType: 'blob' as 'json' });
    }

    downloadReciept(partner_id: string, transaction_id:number,user_id:string, first_name:string): Observable<any> {
        return this.http
            .get<BlobPart>(`${this.baseurlCashOutHistoryPrintReciept}/${partner_id}/cash-out-transactions/${transaction_id}/print?user_id=${user_id}&first_name=${first_name}`,
                { responseType: 'blob' as 'json' });
    }

}
