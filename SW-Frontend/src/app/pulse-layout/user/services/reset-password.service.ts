import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from 'services/local-storage.service';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { ResetPasswordUserListResponse } from '../models/reset-password';

/**
 * SW Reset Password Service
 * Author: Thisura Munasinghe
 * Created Date: 2021 August 3
 */
@Injectable({
    providedIn: 'root',
})
export class ResetPasswordService {
    baseUrl = `${environment.baseUrl}/user/reset-password/users`;
    baseUrlReset = `${environment.baseUrl}/user/reset-password?`;
    token = this.localStorageService.getToken();
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token,
        }),
    };
    private handleError: HandleError;

    constructor(
        httpErrorHandler: HttpErrorHandler,
        private http: HttpClient,
        private localStorageService: LocalStorageService
    ) {
        this.handleError = httpErrorHandler.createHandleError('Reset Password Service');
    }

    /** Reser Password PUT API */
    reserPassword(userId: string): Observable<any> {
        return this.http.put<any>(this.baseUrlReset + userId, this.httpOptions);
    }

    /**
     * Gets user list
     */
    getUserList(): Observable<ResetPasswordUserListResponse[]> {
        return this.http
            .get<ResetPasswordUserListResponse[]>(this.baseUrl, this.httpOptions)
            .pipe(
                catchError(
                    this.handleError<ResetPasswordUserListResponse[]>('Get User List Details')
                )
            );
    }
}
