import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { ProductPerformance } from '../models/historical-performance';

/**
 * SW historical performance service
 * Author: Thilina Kelum
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
export class HistoricalPerformanceService {
    baseUrl = `${environment.baseUrl}/kpi`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Historical Performance Service');
    }

    /** GET Historical Performance of Products */
    gerHistoricalPerformanceByOutletPlanAndProduct(
        outletIds: string,
        plan: string,
        productId: number
    ): Observable<ProductPerformance> {
        return this.http
            .get<ProductPerformance>(
                this.baseUrl +
                    '/dealer/historical-performance?' +
                    outletIds +
                    '&plan=' +
                    plan +
                    '&product_id=' +
                    productId,
                httpOptions
            )
            .pipe(catchError(this.handleError<ProductPerformance>('getProducts')));
    }
}
