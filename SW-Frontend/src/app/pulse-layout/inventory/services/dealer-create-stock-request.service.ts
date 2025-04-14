import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@app/SW-layout/inventory/models/state';
import { StorageSettings } from 'constants/StorageSettings';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';
import { LocalStorageService } from 'services/local-storage.service';

import {
    AddNewAddressRequest,
    DealerConfirmStockOrderDeliveryDetailsRequest,
    DealerConfirmStockOrderDeliveryDetailsResponse,
    DeliveryAddressResponse,
    UserInformation,
} from '../models/dealer-confirm-stock-order-delivery-details';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
  providedIn: 'root'
})
export class DealerCreateStockRequestService {

    private baseurlConfirm = `${environment.baseUrl}/outlet/inventory/dealer-stock-transfer-request`;
    private baseurlStateList = `${environment.baseUrl}/user/states`;
    private baseurlMainAddress = `${environment.baseUrl}/user/outlet`;
    private baseurlDeliveryAddresses = `${environment.baseUrl}/user/delivery-address`;
    private baseurlAddNewAddress = `${environment.baseUrl}/user/delivery-address/create`;
    private baseurlUpdateAddress = `${environment.baseUrl}/user/delivery-address/update`;

    private readonly handleError: HandleError;

  constructor(
      private http: HttpClient,
      httpErrorHandler: HttpErrorHandler,
      private localStorageService: LocalStorageService,
  ) {
      this.handleError = httpErrorHandler.createHandleError('Dealer Create Stock Request Service');
  }

  retrieveStates(): Observable<Array<State>> {
      return this.http
          .get<Array<State>>(this.baseurlStateList)
          .pipe(catchError(this.handleError<Array<State>>('retrieveStates')));
  }

  getMainAddress(outletId: string): Observable<{ outlet_id: string, main_address: string, dms_address:boolean }> {
      return this.http
          .get<{ outlet_id: string, main_address: string, dms_address:boolean }>(`${this.baseurlMainAddress}/${outletId}/main-address?login_name=${this.localStorageService.get(StorageSettings.LOGIN_NAME)}`)
          .pipe(catchError(this.handleError<{ outlet_id: string, main_address: string, dms_address:boolean }>('getMainAddress')));
  }

  getDealerOwner(outletId: string): Observable<UserInformation> {
      return this.http
          .get<UserInformation>(`${this.baseurlMainAddress}/${outletId}/dealer-owner`);
  }

    getDeliveryAddresses(outletId: string): Observable<Array<DeliveryAddressResponse>> {
        return this.http
            .get<Array<DeliveryAddressResponse>>(`${this.baseurlDeliveryAddresses}/${outletId}`)
            .pipe(catchError(this.handleError<Array<DeliveryAddressResponse>>('getDeliveryAddresses')));
    }

  addNewAddress(outletId: string, request: AddNewAddressRequest): Observable<{ address_id: number }> {
      httpOptions.headers = httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
      return this.http
          .post<{ address_id: number }>(`${this.baseurlAddNewAddress}?outlet-id=${outletId}`, request, httpOptions);
  }

  updateAddress(addressId: number, outletId: string, request: AddNewAddressRequest): Observable<{ address_id: number }> {
      httpOptions.headers = httpOptions.headers.set('User-ID', this.localStorageService.get(StorageSettings.LOGIN_NAME));
      return this.http
          .put<{ address_id: number }>(`${this.baseurlUpdateAddress}/${addressId}?outlet-id=${outletId}`, request, httpOptions);
  }

  confirmStockOrderDeliveryDetails(
      request: DealerConfirmStockOrderDeliveryDetailsRequest
  ): Observable<DealerConfirmStockOrderDeliveryDetailsResponse> {
      return this.http
          .post<DealerConfirmStockOrderDeliveryDetailsResponse>(`${this.baseurlConfirm}`, request);
  }
}
