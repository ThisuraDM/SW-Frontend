import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import { ConfirmStocks } from '@app/SW-layout/inventory/models/bc-stock-request-other-store';
import {
    AcknowledgeStockTransferRequest,
    ApproveStockTransferRequest,
    BCTrackStockSummaryPrintRequest,
    BcViewStockTransferDetailsBcToBc,
    RejectStockTransferRequest,
    SearchSerialNumberRequest,
    StockTransferSerialRequest,
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { BCStock, BCStockSearchRequest, ProductBrand, ProductCategory } from '../models/bc-view-stock';

import { PrintDetails, RequestSummaryRequest, StockRequestSummary } from './../models/bc-view-stock-request-summary';
import { OutletList, Regions } from './../models/region';
import { StockDetails } from './../models/view-stock-details';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { StorageSettings } from '../../../../constants/StorageSettings';
import { StockReturnRequestSummaryRequest } from '../models/bc-stock-return';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};
@Injectable({
    providedIn: 'root'
})
export class BcViewStockService {

    private baseurlProductCategoryList = `${environment.baseUrl}/outlet/inventory/product-categories?scenario_type=`;
    private baseurlBrandList = `${environment.baseUrl}/outlet/inventory/product-brands`;
    private baseUrlProductDetailView = `${environment.baseUrl}/outlet/inventory/stocks`;
    private baseurlRegions = `${environment.baseUrl}/user/regions`;
    private baseurlOutletRegions = `${environment.baseUrl}/user/outlets/region`;
    private baseurlBCStockList = `${environment.baseUrl}/outlet/inventory/stock`;
    private baseurlOutletList = `${environment.baseUrl}/user/outlets`;
    private baseurlOutletListByRegion = `${environment.baseUrl}/user/outlets/region`;
    private baseurlStockTransferDetails = `${environment.baseUrl}/outlet/inventory/transfer-details`;
    private baseurlSearchSerialNumbers = `${environment.baseUrl}/outlet/inventory/transfer-request-serial-numbers`;
    private baseurlSaveStockTransferSerialNumbers = `${environment.baseUrl}/outlet/inventory/transfer-stocks`;
    private baseurlPrintTransferStockRequest = `${environment.baseUrl}/outlet/inventory/stock-transfer-summary`;
    private baseurlCategorySerializable = `${environment.baseUrl}/outlet/inventory/product-category`;
    private baseurlConfirmStocks = `${environment.baseUrl}/outlet/inventory/transfer-stocks`;
    private baseurlStockRequestSummary = `${environment.baseUrl}/outlet/inventory/transfer-details`;
    private baseurlPrintStockRequestSummaryBC = `${environment.baseUrl}/outlet/inventory/stock-request-summary-bc`;
    private baseurlPrintStockRequestSummary = `${environment.baseUrl}/outlet/inventory/stock-request-summary`;
    private baseurlMainAddress = `${environment.baseUrl}/user/outlet`;
    private baseurlPrintReturnRequestSummaryToWarehouse = `${environment.baseUrl}/outlet/stock-return-request-summary`;

    private readonly handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,
    ) {
        this.handleError = httpErrorHandler.createHandleError('BC View Stock Service');
    }

    getMainAddress(outletId: string): Observable<{ outlet_id: string, main_address: string }> {
        return this.http
            .get<{ outlet_id: string, main_address: string }>(`${this.baseurlMainAddress}/${outletId}/main-address`)
            .pipe(catchError(this.handleError<{ outlet_id: string, main_address: string }>('getMainAddress')));
    }

    getProductCategoryList(isDealarToPlant:number): Observable<Array<ProductCategory>> {
        return this.http
            .get<Array<ProductCategory>>(this.baseurlProductCategoryList+isDealarToPlant)
            .pipe(catchError(this.handleError<Array<ProductCategory>>('getProductCategoryList')));
    }

    getProductBrandListByCategory(categoryValue: string): Observable<Array<ProductBrand>> {
        return this.http
            .get<Array<ProductBrand>>(`${this.baseurlBrandList}?value=${categoryValue}`)
            .pipe(catchError(this.handleError<Array<ProductBrand>>('getProductBrandListByCategory')));
    }

    getRegions(): Observable<Array<Regions>> {
        return this.http
            .get<Array<Regions>>(`${this.baseurlRegions}`)
            .pipe(catchError(this.handleError<Array<Regions>>('getRegions')));
    }
    getStoresByRegions(RegionName:string): Observable<Array<OutletList>> {
        return this.http
            .get<Array<OutletList>>(`${this.baseurlOutletRegions}/${RegionName}?is_blue_cube=true`)
            .pipe(catchError(this.handleError<Array<OutletList>>('getRegions')));
    }

    getProductDetailView(page: number, pageSize: number, sp_code: string, store_id: string): Observable<StockDetails> {
        return this.http
            .get<StockDetails>(`${this.baseUrlProductDetailView}/item-details?page=${page}&sap_code=${sp_code}&size=${pageSize}&store_id=${store_id}`)
            .pipe(catchError(this.handleError<StockDetails>('getProductCategoryList')));
    }

    fileExportAndDownload(sp_code: string, store_id: string, product_name: string): Observable<any> {
        return this.http
            .get<BlobPart>(`${this.baseUrlProductDetailView}/download/stock-details?item_name=${product_name}&sap_material_code=${sp_code}&store_id=${store_id}`, { headers: httpOptions.headers, responseType: 'blob' as 'json', observe: 'response' })
            .pipe(catchError(this.handleError<BlobPart>('fileExportAndDownload')));

    }

    bcOwnStockSearch(searchRequest: BCStockSearchRequest): Observable<Array<BCStock>> {
        return this.http
            .get<Array<BCStock>>(
                `${this.baseurlBCStockList}/${searchRequest.store_id}`,
                { params: this.setParamsForSearchAndExport(searchRequest) }
            );
        // .pipe(catchError(this.handleError<Array<BCStock>>('getBCStockSearchResults')));
    }

    bcOwnStockExport(searchRequest: BCStockSearchRequest): void {
        this.http
            .get<BlobPart>(
                `${this.baseurlBCStockList}/${searchRequest.store_id}/export-summary-csv`,
                { params: this.setParamsForSearchAndExport(searchRequest), responseType: 'blob' as 'json', observe: 'response' }
            )
            // .pipe(catchError(this.handleError<Blob>('getBCStockSearchResults')))
            .subscribe((response) => {
                const file = new Blob([response.body as BlobPart], { type: 'text/csv' });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = `Stock Level Summary.csv`;
                a.click();
                document.body.removeChild(a);
            });
    }
    downloadBCReportSummary(userId: string, type: string, store_id: string): Observable<any> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .get<string>(
                `${this.baseurlBCStockList}/stocks/bc/stock-details/${type}?store_id=${store_id}`, { headers: httpOptions.headers, responseType: 'blob' as 'json', observe: 'response' },
            );
    }
    downloadDealerReportSummary(userId: string, type: string, store_id: string): Observable<any> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .get<BlobPart>(
                `${this.baseurlBCStockList}/stocks/outlet/stock-details/${type}?store_id=${store_id}`
                , { headers: httpOptions.headers, responseType: 'blob' as 'json', observe: 'response' }
            );
    }
    private setParamsForSearchAndExport(searchRequest: BCStockSearchRequest): HttpParams {
        let params = new HttpParams();
        if (searchRequest.brand && searchRequest.brand !== 'null') {
            params = params.append('brand', searchRequest.brand);
        }
        if (searchRequest.category && searchRequest.category !== 'null') {
            params = params.append('category', searchRequest.category);
        }
        if (searchRequest.item_name) {
            params = params.append('item_name', searchRequest.item_name);
        }
        if (searchRequest.material_code) {
            params = params.append('material_code', searchRequest.material_code);
        }
        return params;
    }

    getOutletListByOutletType(outletType: 'BC' | 'DEALER'): Observable<Array<Outlets>> {
        return this.http
            .get<Array<Outlets>>(`${this.baseurlOutletList}/${outletType}`)
            .pipe(catchError(this.handleError<Array<Outlets>>('getOutletListByOutletType')));
    }

    getStockTransferDetails(requestId: string): Observable<BcViewStockTransferDetailsBcToBc> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        let params = new HttpParams();
        params = params.append('outletId', (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id);
        params = params.append('request_id', requestId);
        return this.http
            .get<BcViewStockTransferDetailsBcToBc>(`${this.baseurlStockTransferDetails}`, { headers: httpOptions.headers, params })
            .pipe(catchError(this.handleError<BcViewStockTransferDetailsBcToBc>('getStockTransferDetails')));
    }
    getStockTransferDetailsCCP(requestId: string, outletId:string): Observable<BcViewStockTransferDetailsBcToBc> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        let params = new HttpParams();
        params = params.append('outletId', outletId);
        params = params.append('request_id', requestId);
        return this.http
            .get<BcViewStockTransferDetailsBcToBc>(`${this.baseurlStockTransferDetails}`, { headers: httpOptions.headers, params })
            .pipe(catchError(this.handleError<BcViewStockTransferDetailsBcToBc>('getStockTransferDetails')));
    }

    printStockTransferDetails(requestObject: BCTrackStockSummaryPrintRequest): void {
        this.http
            .post<BlobPart>(this.baseurlPrintTransferStockRequest, requestObject, { responseType: 'blob' as 'json' })
            .pipe(catchError(this.handleError<BlobPart>('printStockTransferDetails')))
            .subscribe(response => {
                const file = new Blob([response], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = `Stock Transfer Summary(BC-BC).pdf`;
                a.click();
                document.body.removeChild(a);
            });
    }

    getOutletListByOutletByRegion(regionName: string, isBlueCube: boolean): Observable<Array<{ store_id: string, store_name: string }>> {
        return this.http
            .get<Array<{ store_id: string, store_name: string }>>(`${this.baseurlOutletListByRegion}/${regionName}?is_blue_cube=${isBlueCube}`)
            .pipe(catchError(this.handleError<Array<{ store_id: string, store_name: string }>>('getOutletListByOutletByRegion')));
    }

    searchSerialNumbers(searchRequest: SearchSerialNumberRequest): Observable<Array<{ serial_number: string }>> {
        return this.http
            .get<Array<{ serial_number: string }>>(
                this.baseurlSearchSerialNumbers,
                { params: this.setParamsForSearchSerialNumberAPI(searchRequest) }
            );
    }

    saveStockTransferSerialNumbers(requestObject: StockTransferSerialRequest, requestId: string): Observable<{ status: string }> {
        return this.http
            .put<{ status: string }>(
                `${this.baseurlSaveStockTransferSerialNumbers}/${requestId}/transfer`, requestObject
            );
    }

    stockTransferReject(requestObject: RejectStockTransferRequest, requestId: string): Observable<{ status: string }> {
        return this.http
            .put<{ status: string }>(
                `${this.baseurlSaveStockTransferSerialNumbers}/${requestId}/reject`, requestObject
            );
    }

    stockTransferApprove(requestObject: ApproveStockTransferRequest, requestId: string): Observable<{ status: string }> {
        return this.http
            .put<{ status: string }>(
                `${this.baseurlSaveStockTransferSerialNumbers}/${requestId}/approve`, requestObject
            );
    }

    stockTransferAcknowledge(requestObject: AcknowledgeStockTransferRequest, requestId: string, originOutletType: string): Observable<{ status: string }> {
        return this.http
            .put<{ status: string }>(
                `${this.baseurlSaveStockTransferSerialNumbers}/${requestId}/acknowledge?origin_outlet_type${originOutletType}`, requestObject
            );
    }

    private setParamsForSearchSerialNumberAPI(searchRequest: SearchSerialNumberRequest): HttpParams {
        let params = new HttpParams();

        params = params.append('sap_code', searchRequest.sap_code);
        params = params.append('store_id', searchRequest.store_id);

        if (searchRequest.from_serial && searchRequest.from_serial !== 'null') {
            params = params.append('from_serial', searchRequest.from_serial);
        }
        if (searchRequest.to_serial && searchRequest.to_serial !== 'null') {
            params = params.append('to_serial', searchRequest.to_serial);
        }

        return params;
    }

    confirmStocks(request: ConfirmStocks): Observable<{ result: string, request_id: string }> {
        return this.http
            .post<{ result: string, request_id: string }>(`${this.baseurlConfirmStocks}`, request);
    }

    checkCategorySerializable(categoryCode: string): Observable<{ product_type: 'SERIAL' | 'NON_SERIAL' }> {
        return this.http
            .get<{ product_type: 'SERIAL' | 'NON_SERIAL' }>(`${this.baseurlCategorySerializable}/${categoryCode}/product-types`)
            .pipe(catchError(this.handleError<{ product_type: 'SERIAL' | 'NON_SERIAL' }>('checkCategorySerializable')));
    }

    getStockRequestSummary(outletId: string, requestId: string): Observable<StockRequestSummary> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        let params = new HttpParams();
        params = params.append('outletId', outletId);
        params = params.append('request_id', requestId);
        return this.http
            .get<StockRequestSummary>(`${this.baseurlStockRequestSummary}`
                , { headers: httpOptions.headers, params })
            .pipe(catchError(this.handleError<StockRequestSummary>('getStockRequestSummary')));
    }

    getStockReturnRequestSummaryToWarehouse(outletId: string, requestId: string): Observable<BcViewStockTransferDetailsBcToBc> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        let params = new HttpParams();
        params = params.append('outletId', outletId);
        params = params.append('request_id', requestId);
        return this.http
            .get<BcViewStockTransferDetailsBcToBc>(`${this.baseurlStockRequestSummary}`
                , { headers: httpOptions.headers, params })
            .pipe(catchError(this.handleError<BcViewStockTransferDetailsBcToBc>('getStockReturnRequestSummaryToWarehouse')));
    }


    printSummaryBc(request: PrintDetails) {
        return this.http.post(`${this.baseurlPrintStockRequestSummaryBC}`, request, {
            observe: 'response',
            responseType: 'blob'
        })
            .pipe(catchError(this.handleError<any>('printStockSummaryBC')));
    }

    printSummary(request: RequestSummaryRequest) {
        const newHttpOptions = {
            headers: httpOptions.headers,
            responseType: 'blob' as 'json',
        };
        return this.http.post(`${this.baseurlPrintStockRequestSummary}`, request, newHttpOptions)
            .pipe(catchError(this.handleError<any>('printStockSummary')));
    }

    printReturnRequestSummaryToWarehouse(request: StockReturnRequestSummaryRequest) {
        return this.http.post(`${this.baseurlPrintReturnRequestSummaryToWarehouse}`, request, {
            observe: 'response',
            responseType: 'blob'
        })
            .pipe(catchError(this.handleError<any>('printReturnRequestSummaryToWarehouse')));
    }
}
