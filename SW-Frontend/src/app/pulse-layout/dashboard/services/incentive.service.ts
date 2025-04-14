import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { Incentive } from '../models/incentive';

/**
 * SW incentive service
 * Author: Thisura Munasinghe
 * Created Date: 2021 September 8
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
export class IncentiveService {
    baseUrl = `${environment.baseUrl}/kpi/dealer/`;
    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Incentive Service');
    }

    /** GET Products from the server */
    getIncentiveReport(outletId: string): Observable<Incentive[]> {
        return this.http
            .get<Incentive[]>(this.baseUrl + 'incentives?' + outletId, httpOptions)
            .pipe(catchError(this.handleError<Incentive[]>('getIncentiveReport')));
    }
}
