import { ThresholdPreviousDetails } from './../../models/threshold/threshold-previous-details';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    PaymentSource,
    ReceiptDetailsBank,
    TransactionType,
} from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';

import { StorageSettings } from '../../../../../constants/StorageSettings';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { BankInType } from '../../models/threshold/bank-in-type';
import { ThresholdDetails } from '../../models/threshold/threshold-details';

import { AddCollectionResponce } from './../../models/threshold/add-collection-responce';
import { DealerThresholds } from './../../models/threshold/dealer-thresholds';
import { PaymentChannel } from './../../models/threshold/payment-channel';
import { ReferanceId } from './../../models/threshold/referance-id';
import { ThresholdsCollection } from './../../models/threshold/threshold-collection';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class ThresholdService {

    private baseurlBankList = `${environment.baseUrl}/outlet/threshold/bank-in-types`;
    private baseurlReferanceId = `${environment.baseUrl}/outlet/threshold/reference-ids`;
    private baseurlPaymentSourceList = `${environment.baseUrl}/outlet/payment-sources`;
    private baseurlPaymentChannelList = `${environment.baseUrl}/outlet/threshold/payment-channels`;
    private baseurlReceiptDetailsBankList = `${environment.baseUrl}/outlet/v1/receipt-details-banks`;
    private baseurlTransactionTypeList = `${environment.baseUrl}/outlet/transaction-type`;
    private baseurlPastThresholds = `${environment.baseUrl}/outlet/threshold/past-collections?`;
    private baseurlThreshold = `${environment.baseUrl}/outlet/threshold`;
    private baseurlThresholdInventory = `${environment.baseUrl}/user/dealer-retrieve/outlet`;
    private baseurlThresholdCollection = `${environment.baseUrl}/outlet/threshold/collections`;
    private baseurlThresholdImageDownload = `${environment.baseUrl}/outlet/threshold/threshold-collection-attachments`;
    private baseurlDeleteCollection = `${environment.baseUrl}/outlet/threshold/threshold-collection-details`;

    private readonly handleError: HandleError;
    private isThresholdSubmitted = new Subject<boolean>();
    private isThreshold30Exceeded = new Subject<boolean>();
    private addNewCollection = new Subject<boolean>();



    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,
    ) {
        this.handleError = httpErrorHandler.createHandleError('CNU Service');
        this.isThresholdSubmitted.next(false);
    }

    getBankInTypeList(): Observable<Array<BankInType>> {
        return this.http
            .get<Array<BankInType>>(this.baseurlBankList)
            .pipe(catchError(this.handleError<Array<BankInType>>('getCNUBankList')));
    }
    getReferanceIdList(): Observable<Array<ReferanceId>> {
        return this.http
            .get<Array<ReferanceId>>(this.baseurlReferanceId)
            .pipe(catchError(this.handleError<Array<ReferanceId>>('getCNUBankList')));
    }

    getPaymentSourceList(): Observable<Array<PaymentSource>> {
        return this.http
            .get<Array<PaymentSource>>(this.baseurlPaymentSourceList)
            .pipe(catchError(this.handleError<Array<PaymentSource>>('getCNUPaymentSourceList')));
    }

    getTransactionTypeList(): Observable<Array<TransactionType>> {
        return this.http
            .get<Array<TransactionType>>(this.baseurlTransactionTypeList)
            .pipe(catchError(this.handleError<Array<TransactionType>>('getCNUTransactionTypeList')));
    }

    getPaymentMethodList(): Observable<Array<PaymentChannel>> {
        return this.http
            .get<Array<PaymentChannel>>(this.baseurlPaymentChannelList)
            .pipe(catchError(this.handleError<Array<PaymentChannel>>('getCNUPaymentMethodList')));
    }

    getReceiptDetailsBankList(): Observable<Array<ReceiptDetailsBank>> {
        return this.http
            .get<Array<ReceiptDetailsBank>>(this.baseurlReceiptDetailsBankList)
            .pipe(catchError(this.handleError<Array<ReceiptDetailsBank>>('getCNUReceiptDetailsBankList')));
    }

    getPastThresholdList(userId:string,date:string,storeCode:string,pageNo:number,pageSize:number): Observable<ThresholdDetails[]> {
        httpOptions.headers =
              httpOptions.headers.set('User-ID', userId);

          return this.http
              .get<ThresholdDetails[]>(`${this.baseurlPastThresholds}limit=${pageSize}&outlet_id=${storeCode}&page=${pageNo}&period_index=${date}`, httpOptions)
              .pipe(catchError(this.handleError<ThresholdDetails[]>('getPastThresholdList')));
      }
    getThresholdDetails(outletId:string,userId:string): Observable<DealerThresholds> {
        httpOptions.headers =
              httpOptions.headers.set('User-ID', userId);
        return this.http
            .get<DealerThresholds>(`${this.baseurlThresholdInventory}?outletId=${outletId}`,httpOptions)
            .pipe(catchError(this.handleError<DealerThresholds>('getThresholdDetails')));
    }

    getThresholdLimit(outletId:string): Observable<any> {
        return this.http
            .get<any>(`${environment.baseUrl}/ewallet/balance-query/${outletId}`)
            .pipe(catchError(this.handleError<any>('getThresholdLimit')));
    }
    getThresholdPreviousRequests(outletId:string): Observable<ThresholdPreviousDetails> {
        return this.http
            .get<ThresholdPreviousDetails>(`${this.baseurlThreshold}/previous-requests?outlet_id=${outletId}`)
            .pipe(catchError(this.handleError<ThresholdPreviousDetails>('getThresholdDetails')));
    }
    getThresholdCollectionList(outletId:string): Observable<ThresholdsCollection> {
        return this.http
            .get<ThresholdsCollection>(`${this.baseurlThresholdCollection}/?outlet_id=${outletId}`)
            .pipe(catchError(this.handleError<ThresholdsCollection>('getThresholdCollectionList')));
    }

    getImageByImageReference(fileName: string, attachmentId: number): void {
        this.http
            .get<BlobPart>(
                `${this.baseurlThresholdImageDownload}/${attachmentId}/${fileName}`,
                { responseType: 'blob' as 'json', observe: 'response' }
            )
            // .pipe(catchError(this.handleError<Blob>('getImageByImageReference')))
            .subscribe((response:any) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(response.body);
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
            });
    }

    deleteCollection(collectionId: number, userId: string): Observable<{ attachment_path: string }> {
        httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .put<{ attachment_path: string }>(`${this.baseurlDeleteCollection}/${collectionId}`, null, httpOptions)
            .pipe(catchError(this.handleError<{ attachment_path: string }>('deleteCollection')));
    }
    addCollection(saveRequest: any): Observable<AddCollectionResponce> {
        httpOptions.headers = httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        return this.http
            .post<AddCollectionResponce>(this.baseurlThreshold+'/threshold-collection-details', saveRequest, httpOptions);
    }
    uploadAttachment(collection_id:string,store_code_id:string,header_id:string,file:any,): Observable<any>{
        const formData = new FormData();
        formData.append('collection_id', collection_id);
        formData.append('attachment', file);
        formData.append('store_code_id', store_code_id);
        formData.append('header_id', header_id);
        return this.http.post<any>(this.baseurlThreshold+'/threshold-collection-attachments', formData);

    }
    uploadEndDayAttachments(store_code_id:string,filesList:any[],): Observable<any>{
        const formData = new FormData();
        for (let i = 0; i < filesList.length; i++) {
            formData.append('attachments', filesList[i], filesList[i].name);
          }
        formData.append('store_code_id', store_code_id);
        formData.append('user_id', this.localStorageService.get(StorageSettings.LOGIN_NAME));

        return this.http.post<any>(this.baseurlThreshold+'/threshold-end-day-balancing-reports', formData,httpOptions)
        .pipe(catchError(this.handleError<any>('uploadEndDayAttachments')));

    }
    submitThreshold(store_code_id:string,header_id:string,user_id:string): Observable<any> {
        const httpReqOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'my-auth-token',
                'User-ID': user_id,
                'User-Row-ID':this.localStorageService.get(StorageSettings.ROW_ID)
            }),
        };
        return this.http
            .post<any>(`${this.baseurlThreshold}/collections?collection_header_id=${header_id}&outlet_id=${store_code_id}`,null,httpReqOptions);
    }

    thresholdSubmitted() {
        this.isThresholdSubmitted.next(true);
    }
    onthresholdSubmit(): Observable<boolean> {
        return this.isThresholdSubmitted.asObservable();
    }
    threshold30Exceeded(isExceed:boolean){
        this.isThreshold30Exceeded.next(isExceed);
    }
    onthreshold30Exceeded(): Observable<boolean> {
        return this.isThreshold30Exceeded.asObservable();
    }
    addNewCollectionItem(){
        this.addNewCollection.next(true);
    }
    OnAddCollection(): Observable<boolean> {
        return this.addNewCollection.asObservable();
    }
}
