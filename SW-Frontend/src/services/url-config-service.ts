import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { UrlConfig } from '../models/config-url';
import { HandleError, HttpErrorHandler } from '../services/http-error-handler.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class UrlConfigService {
    baseUrl = `${environment.baseUrl}/frontend-config`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('URL Config Service');
    }

    /** GET URL Configs from the server */
    getUrlConfigs(): Observable<UrlConfig> {
        return this.http
            .get<UrlConfig>(this.baseUrl, httpOptions)
            .pipe(catchError(this.handleError<UrlConfig>('getURLConfig')));
    }
}
