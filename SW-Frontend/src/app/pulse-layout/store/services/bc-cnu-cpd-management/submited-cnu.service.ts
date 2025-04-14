import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CNUDetails } from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu-details';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
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
    providedIn: 'root'
  })
  export class SubmitedCnuService {

      private baseurlCNUList = `${environment.baseUrl}/cnu-cpd/cnu/`;
      private baseurlCPDList = `${environment.baseUrl}/cnu-cpd/cpd/`;
      private baseurlRemoveCNU = `${environment.baseUrl}/cnu-cpd/cnu/update-status/`;
      private baseurlCompleteCNU = `${environment.baseUrl}/cnu-cpd/cpd/order-complete/cnu/`;

      private readonly handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,
    ) {
        this.handleError = httpErrorHandler.createHandleError('CNU Service');
    }

    private onAddCNU = new Subject<boolean>();

    getCNUList(userId:string,date:string,storeCode:string,pageNo:number,pageSize:number): Observable<CNUDetails> {
      httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);

        return this.http
            .get<CNUDetails>(`${this.baseurlCNUList}submitted-items?cnu_date=${date}&limit=${pageSize}&outlet_id=${storeCode}&page=${pageNo}&status=Pending`, httpOptions)
            .pipe(catchError(this.handleError<CNUDetails>('getCNUBankList')));
    }

    getCPDList(userId:string,date:string,storeCode:string,pageNo:number,pageSize:number): Observable<CNUDetails> {
      httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);

        return this.http
            .get<CNUDetails>(`${this.baseurlCNUList}submitted-items?cnu_date=${date}&limit=${pageSize}&outlet_id=${storeCode}&page=${pageNo}&status=Pending&status=Completed`, httpOptions)
            .pipe(catchError(this.handleError<CNUDetails>('getCNUBankList')));
    }

    searchCPD(userId:string,date:string,storeCode:string,pageNo:number,pageSize:number,filterBy:string,filterValue:string): Observable<CNUDetails>{
      httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);

        return this.http
            .get<CNUDetails>(`${this.baseurlCNUList}submitted-items?cnu_date=${date}&filter_by=${filterBy}&filter_value=${filterValue}&limit=${pageSize}&outlet_id=${storeCode}&page=${pageNo}&status=Pending&status=Completed`,httpOptions)
            .pipe(catchError(this.handleError<CNUDetails>('getCNUBankList')));
    }

    getListofFileNames(userId:string,date:string,storeCode:string){
      httpOptions.headers =
            httpOptions.headers.set('User-ID', userId);
        return this.http
            .get<any[]>(`${this.baseurlCNUList}cnu-file-names-list?cnu_date=${date}&store_code=${storeCode}`)
            .pipe(catchError(this.handleError<any[]>('getCNUBankList')));
    }
    downloadCPDList(userId:string,date:string,storeCode:string,filterBy:string,filterValue:string){
      httpOptions.headers =
      httpOptions.headers.set('User-ID', userId);
      return this.http.get(`${this.baseurlCPDList}download/submitted-items?cnu_date=${date}&outlet_id=${storeCode}${filterBy?'&filter_by='+filterBy:''}${filterValue?'&filter_value='+filterValue:''}`, {
        headers: httpOptions.headers,
        observe: 'response',
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError<any>('downloadCPDList')));
    }

    deleteCNU(cnuId: number): Observable<{cnu_id: number, cnu_status: string, last_modified_date: Date}> {
        httpOptions.headers = httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
        return this.http
            .put<{cnu_id: number, cnu_status: string, last_modified_date: Date}>(`${this.baseurlRemoveCNU}${cnuId}`, null, httpOptions)
            .pipe(catchError(this.handleError<{cnu_id: number, cnu_status: string, last_modified_date: Date}>('deleteCNU')));
    }

    completeCNU(userId:string,cnuId: number,tranactionId:string){
      httpOptions.headers =
      httpOptions.headers.set('User-ID', userId);
      return this.http
      .put<{cnu_id: number, cnu_status: string, last_modified_date: Date}>(`${this.baseurlCompleteCNU}${cnuId}`, {transaction_id:tranactionId},httpOptions)
      .pipe(catchError(this.handleError<{cnu_id: number, cnu_status: string, last_modified_date: Date}>('completeCNU')));
    }

    addNewCNUItem(){
      this.onAddCNU.next(true);
    }
    OnAddCNU(): Observable<boolean> {
        return this.onAddCNU.asObservable();
    }

  }

