import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayoutHistoryIncentiveType } from '@app/SW-layout/incentive/models/dealer-incentive-payout-history';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';


/**
 * SW dealer incentive service
 * Author: Thilina Kalum
 * Created Date: 2022 March 08
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
export class DealerIncentivePayoutHistoryService {

    private readonly handleError: HandleError;
    private payoutHistoryIncentiveTypeURL = `${environment.baseUrl}/outlet/incentive/incentive-types`;
    private incentivePayoutHistoryDownloadURL = `${environment.baseUrl}/outlet/incentive/payout-history`;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Daily Trend Service');
    }

    getPayoutHistoryIncentiveTypes(): Observable<PayoutHistoryIncentiveType[]> {
        return this.http
            .get<PayoutHistoryIncentiveType[]>(this.payoutHistoryIncentiveTypeURL, httpOptions)
            .pipe(catchError(this.handleError<PayoutHistoryIncentiveType[]>('GetPayoutHistoryIncentiveTypes')));
    }

    downloadIncentivePayoutHistory(incentiveType: string | undefined, monthId: string | undefined, vendorId: string | undefined) {
        return this.http
            .get(this.incentivePayoutHistoryDownloadURL + '?incentive_type=' + incentiveType + '&month_id=' + monthId + '&vendor_id=' + vendorId, {
                headers: httpOptions.headers,
                observe: 'response',
                responseType: 'blob',
            });
    }
}
