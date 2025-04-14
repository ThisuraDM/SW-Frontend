import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';

import {
    CreditNoteReason,
    CreditNoteVoucher,
    PaymentMethod,
    PromoItemPriceRequest,
    RcspCreateStockRequest,
    RcspCreateStockResponse,
    RcspPromoObject,
    RcspStock,
} from '../models/dealer-physical-stock-ordering';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};
@Injectable({
    providedIn: 'root'
})
export class DealerPhysicalStockOrderingService {
    private baseurlCreditNoteVoucher = `${environment.baseUrl}/outlet/inventory/credit-note-vouchers`;
    private baseurlCreditNoteReasons= `${environment.baseUrl}/outlet/inventory/credit-note-reasons`;
    private baseurlPaymentMethods = `${environment.baseUrl}/outlet/inventory/payment-methods/`;
    private baseurlGetRcspStocks = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks/`;
    private baseurlGetRcspProducts = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks/`;
    private baseurlGetRcspPromotions = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks/`;
    private baseurlGetTotalItemValue = `${environment.baseUrl}/outlet/inventory/sp-rc-stocks/`;

    private readonly handleError: HandleError;
    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
    ) {
        this.handleError = httpErrorHandler.createHandleError('Dealer Physical Stock Ordering');
    }

    getCreditNoteVouchers(): Observable<Array<CreditNoteVoucher>> {
        return this.http
            .get<Array<CreditNoteVoucher>>(this.baseurlCreditNoteVoucher)
            .pipe(catchError(this.handleError<Array<CreditNoteVoucher>>('getCreditNoteVouchers')));
    }
    getCreditNoteReasons(): Observable<Array<CreditNoteReason>> {
        return this.http
            .get<Array<CreditNoteReason>>(this.baseurlCreditNoteReasons)
            .pipe(catchError(this.handleError<Array<CreditNoteReason>>('getCreditNoteReasons')));
    }

    getPaymentMethods(productType: string): Observable<Array<PaymentMethod>> {
        return this.http
            .get<Array<PaymentMethod>>(`${this.baseurlPaymentMethods}${productType}`)
            .pipe(catchError(this.handleError<Array<PaymentMethod>>('getPaymentMethods')));
    }

    getRcspStocks(outletId: string, categoryName:string, itemName:string, sapMaterialCode:string, page:number, size:number): Observable<RcspStock> {
        return this.http
            .get<RcspStock>(`${this.baseurlGetRcspStocks}${outletId}?limit=${size}&page=${page}&category_name=${categoryName}&item_name=${itemName}&sap_material_code=${sapMaterialCode}`);
    }

    getSpRcPromotionDetails(outletId: string): Observable<RcspPromoObject> {
        return this.http
            .get<RcspPromoObject>(`${this.baseurlGetRcspPromotions}${outletId}/promotions?limit=1000&page=0`);
    }

    getSpRcProducts(outletId: string): Observable<Array<string>> {
        return this.http
            .get<Array<string>>(`${this.baseurlGetRcspProducts}${outletId}/product-categories`)
            .pipe(catchError(this.handleError<Array<string>>('baseurlGetRcspProducts')));
    }

    createSpRcStocks(outletId: string, createRequest: RcspCreateStockRequest): Observable<RcspCreateStockResponse> {
        return this.http
            .post<RcspCreateStockResponse>(`${this.baseurlGetRcspStocks}${outletId}/orders`, createRequest);
    }

    getTotalItemValue(outletId: string, promoItemPriceRequest: PromoItemPriceRequest): Observable<number> {
        return this.http
            .post<number>(`${this.baseurlGetTotalItemValue}${outletId}/total-value`, promoItemPriceRequest);
    }
}
