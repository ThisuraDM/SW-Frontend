import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { ProductTrend } from '../models/product-trend';

/**
 * SW product trend service
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 10
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
export class ProductsTrendService {
    baseUrl = `${environment.baseUrl}/kpi/bluecube/outlets/products/`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Product Trend Service');
    }

    /** GET Products from the server */
    getProductTrends(
        productId: number,
        month: string,
        outletId: string
    ): Observable<ProductTrend[]> {
        return this.http
            .get<ProductTrend[]>(
                this.baseUrl + productId + '/trend?month=' + month + '&outlet_ids=' + outletId,
                httpOptions
            )
            .pipe(catchError(this.handleError<ProductTrend[]>('getProductTrends')));
    }
}
