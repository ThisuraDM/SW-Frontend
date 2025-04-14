import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';
import { IncentiveInfoCard } from '../models/incentive-info-card';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class IncentiveInfoCardService {

    private baseurlGetCategories = `${environment.baseUrl}/outlet/incentive/payout-performance-summary/`;

    private readonly handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Incentive Report Card Service');
    }

    payoutPerformanceSummary(vendor_id: string, month: string): Observable<IncentiveInfoCard> {
        return this.http
            .get<IncentiveInfoCard>(`${this.baseurlGetCategories}${vendor_id}?month_id=${month}`)
            .pipe(catchError(this.handleError<IncentiveInfoCard>('PayoutPerformanceSummary')));
    }

}
