import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { HandleError, HttpErrorHandler } from './../../../../services/http-error-handler.service';
import { SurveyAnswer, SurveyDetails, SurveyQuestion } from '../models/survey-details';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root'
})
export class SatisfactionSurveyHttpService {

    private readonly handleError: HandleError;
    private userSurveyDetailsBaseUrl = `${environment.baseUrl}/user/satisfaction-surveys`;

    constructor(
        private http: HttpClient,
        private httpErrorHandler: HttpErrorHandler,) {
        this.handleError = httpErrorHandler.createHandleError('Satisfaction Survey Service');
    }

    getUserSurveyDetails(userId: string | null): Observable<SurveyDetails> {
        return this.http
            .get<SurveyDetails>(`${this.userSurveyDetailsBaseUrl}/${userId}/eligible-modules`, httpOptions);
    }

    getUserSurveyQuestions(userId: string | null, moduleId: string | null): Observable<SurveyQuestion[]> {
        return this.http
            .get<SurveyQuestion[]>(`${this.userSurveyDetailsBaseUrl}/${userId}/eligible-modules/${moduleId}/questions`, httpOptions);
    }

    saveSurveyQuestions(request: SurveyAnswer[], userId: string | null, moduleId: string | null): Observable<any> {
        return this.http.post(`${this.userSurveyDetailsBaseUrl}/${userId}/eligible-modules/${moduleId}/answers`, request);
    }

    createEligibilityToAndUser( userId: string | null, moduleId: string | null): Observable<any> {
        let request = {
            'module_id': moduleId
        }
        return this.http.post(`${this.userSurveyDetailsBaseUrl}/${userId}/eligible-modules`, request);
    }
}
