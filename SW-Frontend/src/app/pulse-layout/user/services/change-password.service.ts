import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from 'services/local-storage.service';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { ChangePasswordRequest, ChangePasswordResponse, PasswordPolicyResponse } from '../models/change-password';

/**
 * SW Change Password Service
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 3
 */
@Injectable({
    providedIn: 'root',
})
export class ChangePasswordService {
    baseUrl = 'https://graph.microsoft.com/v1.0/me/changePassword';
    baseUrlPasswordPolicy = `${environment.baseUrl}/user/user/password-policy`;
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
        this.handleError = httpErrorHandler.createHandleError('Change Password Service');
    }

    /** Change Password Graph POST API */
    changePassword(requestBody: ChangePasswordRequest): Observable<ChangePasswordResponse> {
        return this.http
            .post<any>(this.baseUrl, requestBody, this.httpOptions)
            .pipe(catchError(this.handleError<any>('Change Password Service API')));
    }

    getPasswordPolicyDetails(): Observable<PasswordPolicyResponse[]> {
        return this.http
            .get<PasswordPolicyResponse[]>(this.baseUrlPasswordPolicy, this.httpOptions)
            .pipe(
                catchError(
                    this.handleError<PasswordPolicyResponse[]>('Get Password Policy Details')
                )
            );
    }
}
