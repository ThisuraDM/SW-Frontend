import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RcspStocks } from '../models/dealer-track-stock';

import { environment } from './../../../../environments/environment';
import { HandleError, HttpErrorHandler } from './../../../../services/http-error-handler.service';
import { LocalStorageService } from './../../../../services/local-storage.service';
import { DealerStockTransferDetails } from './../models/dealer-stock-transfer-details';
import { TransferStatus } from './../models/transfer-status';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};
@Injectable({
  providedIn: 'root'
})
export class DealerSearchStockService {
    private baseurlTransferDetails = `${environment.baseUrl}/outlet/inventory/transfer-stocks/dealer/`;
    private baseurlTransferStatus = `${environment.baseUrl}/outlet/stock/dealer-transfer-status`;
    private baseurlRequestStatus = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks/request-statuses`;
    private baseurlRcspStocks = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks/`;
    private readonly handleError: HandleError;


    constructor( private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,) {
        this.handleError = httpErrorHandler.createHandleError('BC View Stock Service');

        }
    getTransferStatus(): Observable<Array<TransferStatus>> {
        return this.http
            .get<Array<TransferStatus>>(`${this.baseurlTransferStatus}`)
             .pipe(catchError(this.handleError<Array<TransferStatus>>('getTransferStatus')));
    }

    getTransferDetails(userId: string, fromDate: string,toDate: string,  storeCode: string, pageNo: number, pageSize: number,requestId?:string,status?:string): Observable<DealerStockTransferDetails> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);

        return this.http
            .get<DealerStockTransferDetails>(`${this.baseurlTransferDetails}${storeCode}?from_date=${fromDate}&page=${pageNo}&size=${pageSize}&to_date=${toDate}${requestId?'&request_id='+requestId:''}${status?'&status='+status:''}`, httpOptions)
            //.pipe(catchError(this.handleError<TransferDetails>('getTransferDetails')));

    }

    getRcspStocks(outlet: string, startDate: string, endDate: string,status: string,requestId: string, pageNo: number, pageSize: number):Observable<RcspStocks>{
        return this.http
        .get<RcspStocks>(`${this.baseurlRcspStocks}${outlet}/orders/?start_date=${startDate}&end_date=${endDate}&status=${status}&request_id=${requestId}&page=${pageNo}&limit=${pageSize}`)
         .pipe(catchError(this.handleError<RcspStocks>('getRcspStocks')));
    }

    getRequestStatus(): Observable<Array<string>> {
        return this.http
            .get<Array<string>>(`${this.baseurlRequestStatus}`)
            .pipe(catchError(this.handleError<Array<string>>('getTransferStatus')));
    }
}
