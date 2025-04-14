import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { EWalletCashoutTransactionItem, EWalletTransactionResponse } from '../models/e-wallet-transaction-history-data';
import {
    BalanceStatus,
    CashoutRequest,
    CashoutRequestDto,
    PaymentConfirmResponse,
    PinValidationReq,
    PinValidationRes,
    TransferRequest,
    TransferRequestResponse,
} from '../models/ewallet';

/**
 * SW e wallet service
 * Author: Milan Perera
 * Created Date: 2021 October 10
 */
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

const httpOptionsFormData = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class EwalletService {
    baseUrl = `${environment.baseUrl}/ewallet/payment-initiate`;
    baseurlBalanceStatus = `${environment.baseUrl}/ewallet/balance-query/`;
    baseurlPaymentConfirm = `${environment.baseUrl}/ewallet/payment-confirm/`;
    baseurlCashoutPinValidation = `${environment.baseUrl}/ewallet/`;
    baseurlCashoutUserValidation = `${environment.baseUrl}/ewallet/`;
    baseurlCashoutTransaction = `${environment.baseUrl}/ewallet/cash-out/`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('E-Wallet Service');
    }

    /** Initiate transfer request */
    initiateWalletTransfer(requestBody: TransferRequest): Observable<TransferRequestResponse> {
        return this.http
            .post<TransferRequestResponse>(
                this.baseUrl + '/' + requestBody.outlet_id,
                requestBody,
                httpOptions
            )
            .pipe(catchError(this.handleError<TransferRequestResponse>('initiateWalletTransfer')));
    }

    /** Post form data */
    postFormData(requestBody: string): Observable<string> {
        return this.http
            .post<string>(
                'https://test.onlinepayment.SW.com.my/Payment-Testing/OrderPayment',
                requestBody,
                httpOptionsFormData
            )
            .pipe(catchError(this.handleError<string>('postFormData')));
    }

    getEwalletBalanceStatus(outletId: string): Observable<BalanceStatus> {
        return this.http
            .get<BalanceStatus>(this.baseurlBalanceStatus + outletId, httpOptions)
            .pipe(catchError(this.handleError<BalanceStatus>('getEwalletBalanceStatus')));
    }

    getEwalletBalanceStatusRes(outletId: string): Observable<BalanceStatus> {
        return this.http.get<BalanceStatus>(this.baseurlBalanceStatus + outletId, httpOptions);
    }

    confirmPayment(outletId: string, transactionId: string): Observable<PaymentConfirmResponse> {
        return this.http.put<PaymentConfirmResponse>(
            `${this.baseurlPaymentConfirm}${outletId}/${transactionId}`,
            httpOptions
        );
    }

    validatePin(outletId: string, pin:string) {
        const requestBody: PinValidationReq = {
            pin : ''
        }
        requestBody.pin = pin;
         return this.http.post<PinValidationRes>(
            `${this.baseurlCashoutPinValidation}${outletId}/pin-validate`,
            requestBody,
            httpOptions
        );
    }

    validateEligible(outletId: string, user:string) {
         return this.http.get(
            `${this.baseurlCashoutUserValidation}${outletId}/cash-out-transactions/validate?user_id=${user}`,
                { observe: 'response' })
            .pipe(switchMap(res => res.status === 204 ? of([]) : of(res)));
    }

    eWalletCashout(userId:string, outletId: string, request:CashoutRequest) {
        httpOptions.headers =
        httpOptions.headers.set('User-ID', userId);
         return this.http.post<EWalletTransactionResponse>(
            `${this.baseurlCashoutTransaction}${outletId}`,
            request,
            httpOptions
        );
    }

}
