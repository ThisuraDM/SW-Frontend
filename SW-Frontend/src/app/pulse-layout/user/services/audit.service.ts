import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from 'services/local-storage.service';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { AuditRequest, AuditResponse } from '../models/audit';

const httpOptionsFormData = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class AuditService {
    baseUrl = `${environment.baseUrl}/user/audit`;
    token = this.localStorageService.getToken();
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token,
        }),
    };
    private handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService
    ) {
        this.handleError = httpErrorHandler.createHandleError('Audit Service');
    }

    /** Audit POST API */
    postAuditDetails(
        auditAction: string,
        auditStatus: string,
        description: string
    ): Observable<AuditResponse> {
        const requestBody: AuditRequest = {
            audit_action: '',
            audit_status: '',
            description: '',
        };
        requestBody.audit_action = auditAction;
        requestBody.audit_status = auditStatus;
        requestBody.description = description;
        return this.http
            .post<AuditResponse>(this.baseUrl, requestBody, this.httpOptions)
            .pipe(catchError(this.handleError<AuditResponse>('Audit Service API')));
    }
}
