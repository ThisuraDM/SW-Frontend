import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OutletService } from '@app/SW-layout/dashboard/services/outlet.service';
import { AuditAction, AuditResponse, AuditStatus } from '@app/SW-layout/user/models/audit';
import { AuditService } from '@app/SW-layout/user/services/audit.service';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '@modules/auth/services';
import { Observable } from 'rxjs';

import { StorageSettings } from '../../../constants/StorageSettings';
import { environment } from '../../../environments/environment';
import { LoginDetails } from '../../../models/login-details';
import { HandleError, HttpErrorHandler } from '../../../services/http-error-handler.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import {
    LoginInput,
    LoginSuccess,
    OTPRequestEwallet,
    OTPRespond,
    OTPResponseEwallet,
    ValidateOTPRequest,
    ValidateOTPRequestEwallet,
    ValidateOTPResponse,
    ValidateOTPResponseEwallet,
} from '../models/auth';
import { SurveyDetails } from '../../SW-layout/satisfaction-survey/models/survey-details';
import { SatisfactionSurveyHttpService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey-http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = `${environment.baseUrl}/active-directory`;
    private baseUrlEwalletSendOTP = `${environment.baseUrl}/user/otp`;
    private baseUrlEwalletValidateOTP = `${environment.baseUrl}/user/otp/validate`;
    private userDetailsBaseUrl = `${environment.baseUrl}/user/me`;
    private refreshTokenBaseUrl = `https://login.microsoftonline.com/${environment.msAdTenant}/oauth2/v2.0/token`;
    private readonly handleError: HandleError;
    public sessionId ='';
    public initialLogin = true;

    constructor(
        private http: HttpClient,
        private httpErrorHandler: HttpErrorHandler,
        private localStorageService: LocalStorageService,
        private router: Router,
        private userService: UserService,
        private auditService: AuditService,
        private outletService: OutletService,
        private msalService: MsalService,
        private modalService: NgbModal,
        private satisfactionSurveyHttpService: SatisfactionSurveyHttpService
    ) {
        this.handleError = httpErrorHandler.createHandleError('AuthStoreService');
    }

    loginWithBC(loginInput: LoginInput): Observable<LoginSuccess> {
        return this.http
            .post<LoginSuccess>(`${this.baseUrl}/login`, loginInput, httpOptions);
    }

    sendOTP(sessionId: string): Observable<OTPRespond> {
        return this.http
            .post<OTPRespond>(`${this.baseUrl}/${sessionId}/send-otp`, httpOptions);
    }

    validateOTP(request: ValidateOTPRequest, sessionId: string): Observable<ValidateOTPResponse> {
        this.sessionId = sessionId;
        return this.http
            .post<ValidateOTPResponse>(`${this.baseUrl}/${sessionId}/validate-otp`, request, httpOptions);
    }

    sendOTPEwallet(request:OTPRequestEwallet): Observable<OTPResponseEwallet> {
        return this.http
            .post<OTPResponseEwallet>(`${this.baseUrlEwalletSendOTP}`, request, httpOptions);
    }

    validateOTPEwallet(request:ValidateOTPRequestEwallet): Observable<ValidateOTPResponseEwallet> {
        return this.http
            .post<ValidateOTPResponseEwallet>(`${this.baseUrlEwalletValidateOTP}`, request, httpOptions);
    }

    /** GET templates from the server */
    private getUserDetails(token: string): Observable<LoginDetails> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            }),
        };
        return this.http
            .get<LoginDetails>(this.userDetailsBaseUrl, httpOptions);
    }

    refreshToken() {
        const refreshToken = this.localStorageService.getRefreshToken();
        const httpOptionsGetToken = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': `${environment.origin}`,
            }),
        };
        let b = new URLSearchParams();
        b.set('client_id', `${environment.msAdClientId}`);
        b.set('grant_type', 'refresh_token');
        b.set('scope', 'user.read');
        b.set('refresh_token', refreshToken ? refreshToken : '');
        return this.http.post(this.refreshTokenBaseUrl, b, httpOptionsGetToken);
    }

    async login() {
        const token = this.localStorageService.getToken();
        await new Promise((resolve) => {
            this.getUserDetails(token == null ? 'dummy-token' : token).toPromise().then((loginDetails: any) => {
                console.group(loginDetails);
                this.localStorageService.setOutlets(loginDetails.outlets);
                this.localStorageService.setPermissions(loginDetails.permission);
                this.localStorageService.setRestrictedPermissions(loginDetails.outlet_and_restricted_permissions);
                this.localStorageService.setSessionId(this.sessionId);
                this.localStorageService.add(StorageSettings.NAME, loginDetails.name, false);
                this.localStorageService.add(StorageSettings.EMAIL, loginDetails.email, false);
                this.localStorageService.add(StorageSettings.LOGIN_NAME, loginDetails.login_name, false,);
                this.localStorageService.add(StorageSettings.POSITION, loginDetails.user_position, false,);
                this.localStorageService.add(StorageSettings.ROW_ID, loginDetails.row_id, false,);
                this.localStorageService.add(StorageSettings.STATUS, loginDetails.status, false,);
                this.localStorageService.add(StorageSettings.PHONE_NUMBER, loginDetails.phone_number, false,);

                this.userService.user = {
                    id: loginDetails.login_name,
                    firstName: loginDetails.name,
                    lastName: '',
                    email: loginDetails.email,
                    image: '/assets/img/illustrations/profiles/profile-1.png',
                };
                resolve(true);
                this.satisfactionSurveyHttpService.getUserSurveyDetails(loginDetails.login_name)
                    .subscribe((response: SurveyDetails) => {
                        if (response) {
                            this.localStorageService.setSurvey(response)
                        }
                    });
            }).catch(err => {
                const account = this.msalService.instance.getActiveAccount();
                if (account) {
                    this.router.navigate(['/error/403']);
                    this.modalService.dismissAll();
                }
            });
        });

        this.auditService
            .postAuditDetails(AuditAction.LOGIN, AuditStatus.SUCCESS, 'Login')
            .subscribe((response: AuditResponse) => {
                if (response) {
                }
            });
    }

    async loadRegionAndOutlet() {
        await new Promise((resolve) => {
            this.outletService.getOutlets().subscribe((value) => {
                this.localStorageService.setRegionAndOutlets(value);
                resolve(true);
            });
        });
    }

    logout() {
        this.auditService
            .postAuditDetails(AuditAction.LOGOUT, AuditStatus.SUCCESS, 'Logout')
            .subscribe((response: AuditResponse) => {
                if (response) {
                }
            });
        // Check if user signed in
        const account = this.msalService.instance.getActiveAccount();
        if (account) {
            this.localStorageService.clear();
            sessionStorage.clear();
            this.msalService.logoutRedirect();
            this.modalService.dismissAll();
        } else {
            this.localStorageService.clear();
            sessionStorage.clear();
            this.router.navigate(['/auth-landing']);
            this.modalService.dismissAll();
        }
    }
}
