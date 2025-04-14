import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { Iqms } from '../models/iqms';

/**
 * SW iqms service
 * Author: Thilina Kelum
 * Created Date: 2021 July 10
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
export class IqmsService {
    baseUrl = `${environment.baseUrl}/kpi/bluecube/outlets/iqms`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Iqms Service');
    }

    /** GET Iqms from the server */
    getIqmsInformationByIdAndMonth(ids: string, month: string): Observable<Iqms> {
        return this.http
            .get<Iqms>(this.baseUrl + '?month=' + month + ids, httpOptions)
            .pipe(catchError(this.handleError<Iqms>('getIqms')));
    }
}
