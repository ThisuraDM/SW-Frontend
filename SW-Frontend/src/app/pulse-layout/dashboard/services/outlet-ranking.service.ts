import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { OutletRanking } from '../models/outlet-ranking';

/**
 * SW outlet ranking service
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 15
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
export class OutletRankingService {
    baseUrl = `${environment.baseUrl}/kpi/bluecube/outlets/products/`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Outlet Ranking Service');
    }

    /** GET Products from the server */
    getOutletRanking(
        productId: number,
        limit: number,
        month: string,
        page: number,
        sortby: string
    ): Observable<OutletRanking> {
        return this.http
            .get<OutletRanking>(
                this.baseUrl +
                    productId +
                    '/ranking?limit=' +
                    limit +
                    '&month=' +
                    month +
                    '&page=' +
                    page +
                    '&sort-by=' +
                    sortby,
                httpOptions
            )
            .pipe(catchError(this.handleError<OutletRanking>('getOutletRanking')));
    }
}
