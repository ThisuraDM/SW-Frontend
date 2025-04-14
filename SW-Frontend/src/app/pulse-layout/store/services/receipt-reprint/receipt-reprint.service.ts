import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';
import { TransactionTypes } from '@app/SW-layout/store/models/receipt-reprint/transaction-types';
import {
    TransactionHistoryRequest,
    TransactionHistoryResponse,
} from '@app/SW-layout/store/models/receipt-reprint/transaction-history';
import { LocalStorageService } from '../../../../../services/local-storage.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
        'user-ID': '123',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class ReceiptReprintService {

    private baseurl = `${environment.baseUrl}/outlet`;
    private baseurlTransactionTypeList = `${environment.baseUrl}/outlet/transaction-type`;

    private readonly handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,
    ) {
        this.handleError = httpErrorHandler.createHandleError('Receipt Reprint Service');
        httpOptions.headers = httpOptions.headers.set('user-ID', this.localStorageService.get('login-name'));
    }

    getTransactionTypes(): Observable<Array<TransactionTypes>> {
        return this.http
            .get<Array<TransactionTypes>>(`${this.baseurlTransactionTypeList}/${2}`, httpOptions)
            .pipe(catchError(this.handleError<Array<TransactionTypes>>('transaction type')));
    }

    searchTransactionHistory(transactionHistoryRequest: TransactionHistoryRequest, limit: number, page: number, isBC: boolean, loginName: string): Observable<TransactionHistoryResponse> {
        httpOptions.headers = httpOptions.headers.set('User-Login-Name', loginName);
        const newHttpOptions = {
            headers: httpOptions.headers,
        };
        return this.http
            .post<TransactionHistoryResponse>(this.baseurl + '/transaction/searchTransactions?limit='+limit+'&page='+ page + '&isBC=' + isBC, transactionHistoryRequest, newHttpOptions)
            .pipe(catchError(this.handleError<TransactionHistoryResponse>('search transaction history')));
    }

    receiptReprint(receipt_id: number, transaction_type: string, user: string) {
        httpOptions.headers = httpOptions.headers.set('User-ID', user);
        const newHttpOptions = {
            headers: httpOptions.headers,
            responseType: 'blob' as 'json',
        };
        return this.http
            .get(this.baseurl + '/transaction/rePrintReceipt?receiptId=' + receipt_id + '&transactionType=' + transaction_type, newHttpOptions)
            .pipe(catchError(this.handleError<any>('receipt download')));
    }

    receiptDownload(receipt_id: number, transaction_type: string, user: string) {
        httpOptions.headers = httpOptions.headers.set('User-ID', user);
        const newHttpOptions = {
            headers: httpOptions.headers,
            responseType: 'blob' as 'json',
        };
        return this.http
            .get<any>(this.baseurl + '/transaction/rePrintReceipt?receiptId=' + receipt_id + '&transactionType=' + transaction_type, newHttpOptions)
            .pipe(catchError(this.handleError<any>('receipt download')));
    }

    receiptEmail(receipt_id: number, transaction_type: string, email: string) {
        return this.http
            .post<any>(this.baseurl + '/transaction/email-transaction-receipt?email=' + email + '&receiptId=' + receipt_id + '&transactionType=' + transaction_type, null, httpOptions)
            .pipe(catchError(this.handleError<any>('receipt email')));
    }
}
