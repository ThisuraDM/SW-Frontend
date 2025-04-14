import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegionOutlets } from '@app/SW-layout/dashboard/models/region-outlets';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';

/**
 * SW outlet service
 * Author: Thisura Munasinghe
 * Created Date: 2021 October 20
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
export class OutletService {
    baseUrl = `${environment.baseUrl}/kpi/bluecube`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Outlet Service');
    }

    /** GET Outlets from the server */
    getOutlets(): Observable<RegionOutlets[]> {
        return this.http
            .get<RegionOutlets[]>(this.baseUrl + '/outlets' , httpOptions)
            .pipe(catchError(this.handleError<RegionOutlets[]>('getOutlets')));
    }
}
