import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageSettings } from 'constants/StorageSettings';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from 'services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { TransferStatus } from '../models/transfer-status';

import { HandleError, HttpErrorHandler } from './../../../../services/http-error-handler.service';
import { AcknowledgeDetails } from './../models/bc-ackowledge-details';
import { ConfirmReturnForAPI, InventoryItems, InventoryItemsRequest, Warehouses } from './../models/bc-stock-return';
import { TransferDetails } from './../models/trasfer-details';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};
type NewType = HttpErrorHandler;

@Injectable({
    providedIn: 'root'
})
export class BcSearchStockService {

    private baseurlTransferDetails = `${environment.baseUrl}/outlet/inventory/`;
    private baseurlTransferStatus = `${environment.baseUrl}/outlet/stock/transfer-status/true`;
    private baseurlPrintStockRequestSummary = `${environment.baseUrl}/outlet/inventory/transfer-details/bc/`;
    private baseurlPrintSummaryCCPDealer = `${environment.baseUrl}/outlet/inventory/transfer-details/dealer/`;
    private baseurlTransferStatusCCPDealer = `${environment.baseUrl}/outlet/stock/dealer-stock-transfer-status`;
    private baseUrlAcknowledge = `${environment.baseUrl}/outlet/inventory/acknowledgment-details?request_id=`;
    private baseUrlGetWarehouse = `${environment.baseUrl}/outlet/transfer-warehouses/`;
    private baseUrlGetInventoryReturn = `${environment.baseUrl}/outlet/inventory/stock/`;
    private baseUrlGetInventoryReturnSapCode = `${environment.baseUrl}/outlet/inventory/stock/stock-availability/mat-code`;
    private baseUrlConfirmInventoryReturn = `${environment.baseUrl}/outlet/inventory-return/return-stocks`;


    private readonly handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,

    ) {
        this.handleError = httpErrorHandler.createHandleError('BC View Stock Service');
    }

    getTransferStatus(): Observable<Array<TransferStatus>> {
        return this.http
            .get<Array<TransferStatus>>(`${this.baseurlTransferStatus}`)
             .pipe(catchError(this.handleError<Array<TransferStatus>>('getTransferStatus')));
    }
    
    getTransferStatusDealer(): Observable<Array<TransferStatus>> {
        return this.http
            .get<Array<TransferStatus>>(`${this.baseurlTransferStatusCCPDealer}`)
             .pipe(catchError(this.handleError<Array<TransferStatus>>('getTransferStatusDealer')));
    }

    getTransferDetails(userId: string, fromDate: string,toDate: string,  storeCode: string, pageNo: number, pageSize: number, role?: string,requestId?:string,status?:string,is_warehouse_transfer?:boolean): Observable<TransferDetails> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);

        return this.http
            .get<TransferDetails>(`${this.baseurlTransferDetails}transfer-stocks/${storeCode}?from_date=${fromDate}&page=${pageNo}&size=${pageSize}&to_date=${toDate}&user_role=${role?.toUpperCase()||null}${requestId?'&request_id='+requestId:''}${status?'&status='+status:''}&is_warehouse_transfer=${is_warehouse_transfer||false}`, httpOptions)
            // .pipe(catchError(this.handleError<TransferDetails>('getTransferDetails')));

    }

    getAckowledgeDetails(requestId:string): Observable<AcknowledgeDetails> {
        return this.http
            .get<AcknowledgeDetails>(`${this.baseUrlAcknowledge}${requestId}`)
            // .pipe(catchError(this.handleError<TransferDetails>('getTransferDetails')));

    }
    transferAckowledge(requestId: string,details:any ,origin_outlet_type:string): Observable<any> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        return this.http
            .put<any>(`${this.baseurlTransferDetails}transfer-stocks/${requestId}/acknowledge?origin_outlet_type=${origin_outlet_type}`,details,httpOptions)
            // .pipe(catchError(this.handleError<TransferDetails>('getTransferDetai/)));

    }
    onPrintAcknowledgeSummary(request:any): Observable<any>{
        return this.http
        .post<any>(`${this.baseurlTransferDetails}acknowledge-stock-transfer-summary`,request,
            {
            observe: 'response',
            responseType: 'blob' as 'json'
          })
        // .pipe(catchError(this.handleError<TransferDetails>('getTransferDetai/)));

    }
    onCCPDealerPrintAcknowledgeSummary(outletId:string,requestId:any): Observable<any>{
        return this.http
        .get<any>(`${this.baseurlPrintSummaryCCPDealer}download?outletId=${outletId}&request_id=${requestId}`,
            {
            observe: 'response',
            responseType: 'blob' as 'json'
          })

    }

    bcStockRequestSummary(outletId:string,requestId:string,sapCode:string): Observable<any>{
        return this.http
        .get<any>(`${this.baseurlPrintStockRequestSummary}download?outletId=${outletId}&request_id=${requestId}&sap_material_code=${sapCode}`,
            {
            observe: 'response',
            responseType: 'blob' as 'json'
          })

    }

    getWarehousesByType(type:string): Observable<Warehouses[]> {
        return this.http
            .get<Warehouses[]>(`${this.baseUrlGetWarehouse}${type}`)
            .pipe(catchError(this.handleError<Warehouses[]>('get warehouses by type')));

    }

    // tslint:disable-next-line: variable-name
    searchInventoryForReturn(store_id:string,serial_number:string,category:string,returnTo:string): Observable<InventoryItems[]> {
        return this.http
        .get<InventoryItems[]>(`${this.baseUrlGetInventoryReturn}${store_id}?is_serial=true&serial_number=${serial_number}&category=${category}&return_to=${returnTo}`)
        // .pipe(catchError(this.handleError<InventoryItems[]>('search inventory for return')));
    }

    searchInventoryForReturnFromSapMatCode(request:InventoryItemsRequest): Observable<InventoryItems[]> {
        return this.http
        .post<InventoryItems[]>(`${this.baseUrlGetInventoryReturnSapCode}`, request)
        // .pipe(catchError(this.handleError<InventoryItems[]>('search inventory for return by Sap Mat Code')));
    }

    confirmReturn(request: ConfirmReturnForAPI): Observable<any> {
        return this.http.post(`${this.baseUrlConfirmInventoryReturn}`, request);
    }

}
