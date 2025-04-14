import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from '@app/auth/services/auth.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private tokenService: LocalStorageService,
                private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
        let authReq = req;
        const token = this.tokenService.getToken();
        if (token != null) {
            authReq = this.addTokenHeader(req, token);
        }
        return next.handle(authReq).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return this.handle401Error(authReq, next);
            }
            return throwError(error);
        }));
    }
    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            const token = this.tokenService.getToken();
            if (token)
                return this.authService.refreshToken().pipe(
                    switchMap((token: any) => {
                        this.isRefreshing = false;
                        this.tokenService.setToken(token.access_token);
                        this.refreshTokenSubject.next(token.access_token);

                        return next.handle(this.addTokenHeader(request, token.access_token));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;

                        // this.authService.logout();
                        return throwError(err);
                    })
                );
        }
        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
    }
    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
}
export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
