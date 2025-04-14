import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { KpiInformation } from '../models/kpi-information';

/**
 * SW kpi information service
 * Author: Milan Perera
 * Created Date: 2021 July 15
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
export class KpiInformationService {
    baseUrl = `${environment.baseUrl}/kpi/bluecube/sales`;
    baseUrlDealer = `${environment.baseUrl}/kpi/dealer/activations`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Kpi Information Service');
    }

    /** GET Iqms from the server */
    getKpiInformationByMonthAndOutletIds(month: string, ids: string): Observable<KpiInformation[]> {
        return this.http
            .get<KpiInformation[]>(this.baseUrl + '?month=' + month + ids, httpOptions)
            .pipe(
                catchError(
                    this.handleError<KpiInformation[]>('getKpiInformationByMonthAndOutletIds')
                )
            );
    }

    getDealerKpiInformationByMonthAndOutletIds(
        month: string,
        ids: string
    ): Observable<KpiInformation[]> {
        return this.http
            .get<KpiInformation[]>(this.baseUrlDealer + '?month=' + month + ids, httpOptions)
            .pipe(
                catchError(
                    this.handleError<KpiInformation[]>('getDealerKpiInformationByMonthAndOutletIds')
                )
            );
    }
}
