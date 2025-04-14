import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Bank,
    CnuSaveRequest,
    CNUUpdateDetails,
    PaymentMethod,
    PaymentSource,
    ReceiptDetailsBank,
    TransactionType,
} from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';

import { StorageSettings } from '../../../../../constants/StorageSettings';
import { LocalStorageService } from '../../../../../services/local-storage.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class CnuService {

    private baseurlBankList = `${environment.baseUrl}/cnu-cpd/banks`;
    private baseurlPaymentSourceList = `${environment.baseUrl}/outlet/payment-sources`;
    private baseurlPaymentMethodList = `${environment.baseUrl}/cnu-cpd/payment-methods`;
    private baseurlReceiptDetailsBankList = `${environment.baseUrl}/cnu-cpd/receipt-details-banks`;
    private baseurlTransactionTypeList = `${environment.baseUrl}/outlet/transaction-type`;
    private baseurlSaveCNU = `${environment.baseUrl}/cnu-cpd/cnu`;
    private baseurlGetCNUById = `${environment.baseUrl}/cnu-cpd/cnu`;
    private baseurlUpdateCNU = `${environment.baseUrl}/cnu-cpd/cnu`;

    private readonly handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,
    ) {
        this.handleError = httpErrorHandler.createHandleError('CNU Service');
    }

    getBankList(): Observable<Array<Bank>> {
        return this.http
            .get<Array<Bank>>(this.baseurlBankList)
            .pipe(catchError(this.handleError<Array<Bank>>('getCNUBankList')));
    }

    getPaymentSourceList(): Observable<Array<PaymentSource>> {
        return this.http
            .get<Array<PaymentSource>>(this.baseurlPaymentSourceList)
            .pipe(catchError(this.handleError<Array<PaymentSource>>('getCNUPaymentSourceList')));
    }

    getTransactionTypeList(): Observable<Array<TransactionType>> {
        return this.http
            .get<Array<TransactionType>>(`${this.baseurlTransactionTypeList}/${1}`)
            .pipe(catchError(this.handleError<Array<TransactionType>>('getCNUTransactionTypeList')));
    }

    getPaymentMethodList(): Observable<Array<PaymentMethod>> {
        return this.http
            .get<Array<PaymentMethod>>(this.baseurlPaymentMethodList)
            .pipe(catchError(this.handleError<Array<PaymentMethod>>('getCNUPaymentMethodList')));
    }

    getReceiptDetailsBankList(): Observable<Array<ReceiptDetailsBank>> {
        return this.http
            .get<Array<ReceiptDetailsBank>>(this.baseurlReceiptDetailsBankList)
            .pipe(catchError(this.handleError<Array<ReceiptDetailsBank>>('getCNUReceiptDetailsBankList')));
    }

    saveCNU(saveRequest: CnuSaveRequest): Observable<{amount: number}> {
        httpOptions.headers = httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        return this.http
            .post<{amount: number}>(this.baseurlSaveCNU, saveRequest, httpOptions)
            .pipe(catchError(this.handleError<{amount: number}>('saveCNU')));
    }

    getCNUById(cnuId: number): Observable<CNUUpdateDetails> {
        return this.http
            .get<CNUUpdateDetails>(`${this.baseurlGetCNUById}/${cnuId}`)
            .pipe(catchError(this.handleError<CNUUpdateDetails>('getCNUById')));
    }

    updateCNU(saveRequest: CnuSaveRequest, cnuId: number): Observable<{amount: number}> {
        httpOptions.headers = httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        return this.http
            .put<{amount: number}>(`${this.baseurlUpdateCNU}/${cnuId}`, saveRequest, httpOptions)
            .pipe(catchError(this.handleError<{amount: number}>('updateCNU')));
    }
}
