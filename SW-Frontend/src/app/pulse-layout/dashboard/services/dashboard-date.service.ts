import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { DashboardDate } from '../models/dashboard-date';

/**
 * SW dashboard date service
 * Author: Thisura Munasinghe
 * Created Date: 2021 October 10
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
export class DashboardDateService {
    dealerBaseUrl = `${environment.baseUrl}/kpi/dealer/info`;
    bluecubeBaseUrl = `${environment.baseUrl}/kpi/bluecube/info`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Dashboard Date Service');
    }

    /** GET Dealer Dashboard Date from the server */
    getDealerDashboardDate(): Observable<DashboardDate> {
        return this.http
            .get<DashboardDate>(this.dealerBaseUrl, httpOptions)
            .pipe(catchError(this.handleError<DashboardDate>('getDashboardDate')));
    }

    /** GET BC Dashboard Date from the server */
    getBlucubeDashboardDate(): Observable<DashboardDate> {
        return this.http
            .get<DashboardDate>(this.bluecubeBaseUrl, httpOptions)
            .pipe(catchError(this.handleError<DashboardDate>('getDashboardDate')));
    }
}
