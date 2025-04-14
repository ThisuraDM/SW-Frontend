import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { DailyTrend } from '../models/daily-required-trend';

/**
 * SW daily trend service
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 16
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
export class DailyTrendService {
    baseUrl = `${environment.baseUrl}/kpi/dealer/`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Daily Trend Service');
    }

    /** GET Products from the server */
    getDailyTrend(outletId: string): Observable<DailyTrend[]> {
        return this.http
            .get<DailyTrend[]>(this.baseUrl + 'daily-trend?' + outletId, httpOptions)
            .pipe(catchError(this.handleError<DailyTrend[]>('getDailyTrend')));
    }
}
