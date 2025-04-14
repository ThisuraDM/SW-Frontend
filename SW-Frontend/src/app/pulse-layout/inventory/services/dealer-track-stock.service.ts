import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import {
    DealerStockTransferDetailsGetDetails,
} from '@app/SW-layout/inventory/models/dealer-stock-transfer-details-get-details';
import { ToastService } from '@common/services';
import { StorageSettings } from 'constants/StorageSettings';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError, isEmpty } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';
import { LocalStorageService } from 'services/local-storage.service';

import { DeviceThresholdDetails, DnAStockDetails, DnAStockRequest } from '../models/dealer-physical-stock-ordering';
import { DealerStockTransferAcceptRejectRequest } from '../models/dealer-track-stock';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root'
})
export class DealerTrackStockService {

    private baseurlAcceptReject = `${environment.baseUrl}/outlet/plant-stock-transfer-accept-reject/accept-reject`;
    private baseurlDownloadInvoiceOld = `${environment.baseUrl}/outlet/v1/inventories/stocks_from_plant/dealer/stock-details`;
    private baseurlDownloadInvoice = `${environment.baseUrl}/outlet/inventory`;
    private baseurlTransferDetails = `${environment.baseUrl}/outlet/dealer-stock-transfer-details/get-details`;
    private baseurlGetDeviceThresholdDetails = `${environment.baseUrl}/outlet/inventory/dealer-device-threshold-details`;
    private baseurlGetDnAStockDetails = `${environment.baseUrl}/outlet/inventory/transfer-stocks/dealer/device-and-accessories-stock-details`;
    private baseurlGetDeviceAndAccessoriesStockDetails = `${environment.baseUrl}/outlet/inventory/transfer-stocks/request-to-plant/device-and-accessories-stock-details`;
    private baseurlCancelRcspStocks = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks`;
    private baseurlDownloadInvoiceRcsp = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks`;

    private readonly handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private toastService: ToastService,
        private localStorageService: LocalStorageService,
    ) {
        this.handleError = httpErrorHandler.createHandleError('Dealer Track Stock Service');
    }

    acceptOrRejectTransfer(requestObject: DealerStockTransferAcceptRejectRequest): Observable<{}> {
        return this.http.post(this.baseurlAcceptReject, requestObject)
            .pipe(catchError(this.handleError<{}>('acceptOrRejectTransfer')));
    }

    downloadInvoiceOrDeliveryOrderOld(requestId: string, type: 'Invoice' | 'Delivery_Order'): void {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        this.http.get<BlobPart>(
            `${this.baseurlDownloadInvoice}/${type}?request_id=${requestId}`, httpOptions,
        ).subscribe((response: any) => {
            const file = new Blob([response.body as BlobPart], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, () => {
            this.toastService.show('Unable to download', 'Unable to download');
        });
    }
    // downloadInvoiceOrDeliveryOrder(outletId:string, requestId: string, type: 'SALES_INVOICE' | 'DELIVERY_ORDER'): void {
    //     this.http.get<BlobPart>(
    //         `${this.baseurlDownloadInvoice}/${outletId}/sales-orders/${requestId}/documents?document_type=${type}`, httpOptions,
    //     ).subscribe((response: any) => {
    //         const file = new Blob([response.body as BlobPart], { type: 'application/pdf' });
    //         const fileURL = URL.createObjectURL(file);
    //         window.open(fileURL);
    //     },() => {
    //         this.toastService.show('Unable to download', 'Unable to download');
    //     });
    // }
    downloadInvoiceOrDeliveryOrder(outletId: string, requestId: string, type: 'SALES_INVOICE' | 'DELIVERY_ORDER'): Observable<any> {
        return this.http
            .get<BlobPart>(`${this.baseurlDownloadInvoice}/${outletId}/sales-orders/${requestId}/documents?document_type=${type}`,
                { responseType: 'blob' as 'json' });
    }

    getDeviceThresholdDetails(outletId: string, userId: string): Observable<DeviceThresholdDetails> {
        return this.http
            .get<DeviceThresholdDetails>(`${this.baseurlGetDeviceThresholdDetails}?outlet_Id=${outletId}&user_Id=${userId}`)
            .pipe(catchError(this.handleError<DeviceThresholdDetails>('get Device Threshold Details')));
    }

    getDnAStockDetails(outletId: string, requestObject: DnAStockRequest): Observable<DnAStockDetails[]> {
        return this.http.post<DnAStockDetails[]>(`${this.baseurlGetDnAStockDetails}?outlet_id=${outletId}`, requestObject)
            .pipe(catchError(this.handleError<DnAStockDetails[]>('getDnAStockDetails')));
    }

    getDeviceAndAccessoriesStockDetails(outletId: string, requestObject: DnAStockRequest): Observable<DnAStockDetails[]> {
        return this.http.post<DnAStockDetails[]>(`${this.baseurlGetDeviceAndAccessoriesStockDetails}?outlet_id=${outletId}`, requestObject)
            .pipe(catchError(this.handleError<DnAStockDetails[]>('getDeviceAndAccessoriesStockDetails')));
    }

    retrieveTransferDetails(requestId: string): Observable<DealerStockTransferDetailsGetDetails> {
        let params = new HttpParams();
        params = params.append('request_id', requestId);
        params = params.append('store_id', (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id);
        return this.http
            .get<DealerStockTransferDetailsGetDetails>(`${this.baseurlTransferDetails}`, { params })
            .pipe(catchError(this.handleError<DealerStockTransferDetailsGetDetails>('getStockTransferDetails')));
    }

    cancelRcspStocks(outletId:string, poNumber:string){
        return this.http.delete(`${this.baseurlCancelRcspStocks}/${outletId}/orders/${poNumber}`);
    }

    downloadInvoiceOrDeliveryOrderRcsp(outletId: string, requestId: string): Observable<any> {
        return this.http
            .get<BlobPart>(`${this.baseurlDownloadInvoiceRcsp}/${outletId}/orders/${requestId}/download`,
                { responseType: 'blob' as 'json' });
    }
}
