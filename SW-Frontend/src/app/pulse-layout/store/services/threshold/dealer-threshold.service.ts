import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionType } from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu';
import { DealerThresholdTransactionDetails } from '@app/SW-layout/store/models/threshold/dealer-threshold-transaction-details';
import { StorageSettings } from 'constants/StorageSettings';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DealerPaymentDue } from '../../models/threshold/dealer-payment-due';
import {
    DeviceThreshold,
    DeviceThresholdWithdrawalRequest,
    DeviceThresholdWithdrawalResponse,
} from '../../models/threshold/device-threshold';

import { environment } from './../../../../../environments/environment';
import { HandleError, HttpErrorHandler } from './../../../../../services/http-error-handler.service';
import { LocalStorageService } from './../../../../../services/local-storage.service';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class DealerThresholdService {
    private baseurlDealerPaymentDue = `${environment.baseUrl}/outlet/payment-due-details/`;
    private baseurlDeviceThresholdDetails = `${environment.baseUrl}/outlet/inventory/device-threshold-details/`;
    private baseurlTransactionTypeList = `${environment.baseUrl}/outlet/transaction-type`;
    private baseurlTransactionDetails = `${environment.baseUrl}/outlet/inventory/threshold-transaction-details`;
    private baseurlTransactionDetailsExport = `${environment.baseUrl}/outlet/inventory/threshold-transaction-details-export`;
    private baseurlDeviceThresholdRequest = `${environment.baseUrl}/outlet/inventory/threshold-withdraw-request`;

    private readonly handleError: HandleError;
    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,
    ) {
        this.handleError = httpErrorHandler.createHandleError('Dealer Threshold');
    }

    getPaymentDue(request:any): Observable<Array<DealerPaymentDue>> {
        return this.http
            .post<Array<DealerPaymentDue>>(`${this.baseurlDealerPaymentDue}get-details`,request)
            .pipe(catchError(this.handleError<Array<DealerPaymentDue>>('getPaymentDue')));
    }

    exportPaymentDue(request:any): Observable<any> {
        return this.http
            .post<any>(`${this.baseurlDealerPaymentDue}export`,request,{headers:httpOptions.headers,responseType: 'blob' as 'json', observe: 'response' })
            .pipe(catchError(this.handleError<any>('getPaymentDue')));
    }

    getDeviceThresholdDealer(storeId:any, request:any): Observable<Array<DeviceThreshold>> {
        httpOptions.headers =
        httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        return this.http
            .post<Array<DeviceThreshold>>(`${this.baseurlDeviceThresholdDetails}{id}?id=${storeId}`,request,{headers: httpOptions.headers})
    }

    deviceThresholdWithdrawalRequest(request:DeviceThresholdWithdrawalRequest, outletId: string)
    : Observable<Array<DeviceThresholdWithdrawalResponse>> {
        return this.http
            .post<Array<DeviceThresholdWithdrawalResponse>>(`${this.baseurlDeviceThresholdRequest}?outlet_id=${outletId}`,request);
    }
    getTransactionTypeList(): Observable<Array<TransactionType>> {
        return this.http
            .get<Array<TransactionType>>(`${this.baseurlTransactionTypeList}/${3}`)
            .pipe(catchError(this.handleError<Array<TransactionType>>('getCNUTransactionTypeList')));
    }

    getTransactionDetails(
        dealerId: string, fromDate: string, toDate: string, pageNo: number,
        pageSize: number, transactionType: string
    ): Observable<DealerThresholdTransactionDetails> {
        return this.http
            .get<DealerThresholdTransactionDetails>(
                `${this.baseurlTransactionDetails}?dealer_id=${dealerId}&from_date=${fromDate}&page=${pageNo}&size=${pageSize}&to_date=${toDate}&transaction_type=${transactionType}`
            );

    }

    exportTransactionDetails(
        dealerId: string, fromDate: string, toDate: string, transactionType: string
    ): void {
        this.http
            .get<BlobPart>(
                `${this.baseurlTransactionDetailsExport}?dealer_id=${dealerId}&from_date=${fromDate}&to_date=${toDate}&transaction_type=${transactionType}`
                , {responseType: 'blob' as 'json', observe: 'response'}
    )
            .subscribe((response) => {
                const file = new Blob([response.body as BlobPart], { type: 'text/csv' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });

    }
}
