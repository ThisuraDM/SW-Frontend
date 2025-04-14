import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { DeviceSellingBrandData, DeviceSummary } from '../models/device-summary';

/**
 * SW device activation service
 * Author: Thilina Kelum
 * Created Date: 2021 August 24
 */
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class DeviceActivationService {
    baseUrl = `${environment.baseUrl}/kpi/dealer`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('DeviceActivation Service');
    }

    /** GET Device summary by outlet ids from the server */
    getDeviceSummaryByOutletIds(ids: string): Observable<DeviceSummary> {
        return this.http
            .get<DeviceSummary>(this.baseUrl + '/device-summary?' + ids, httpOptions)
            .pipe(catchError(this.handleError<DeviceSummary>('getDeviceSummaryByOutletIds')));
    }

    /** GET Device summary by outlet ids from the server */
    getDeviceCountByByBrandAndOutletIds(
        type: string,
        ids: string,
        period: string
    ): Observable<DeviceSellingBrandData[]> {
        return this.http
            .get<DeviceSellingBrandData[]>(
                this.baseUrl + '/devices-by-brand?' + type + ids + '&period=' + period,
                httpOptions
            )
            .pipe(
                catchError(
                    this.handleError<DeviceSellingBrandData[]>('getDeviceSummaryByOutletIds')
                )
            );
    }
}
