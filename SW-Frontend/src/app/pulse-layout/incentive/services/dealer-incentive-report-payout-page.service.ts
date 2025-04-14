import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import {
    IncentiveReportDetails,
    PayoutPages,
    PayoutPagesDetailRequest,
    PayoutPagesDetails,
} from '@app/SW-layout/incentive/models/dealer-incentive-report-payout-page';


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
export class DealerIncentiveReportPayoutPageService {

    private readonly handleError: HandleError;
    private incentivePayoutPageURL = `${environment.baseUrl}/outlet/incentive/payout-pages/`;
    private incentivePayoutPageDetailsURL = `${environment.baseUrl}/outlet/incentive/payout-page-details/`;
    private incentiveReportDetailsURL = `${environment.baseUrl}/outlet/incentive/payout-report`;
    private incentiveReportPaymentAdvice = `${environment.baseUrl}/outlet/incentive/`;
    private incentiveEligibleAndIneligiblePayoutDetailsURL = `${environment.baseUrl}/outlet/incentive/payout-eligible-ineligible-details`;


    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Daily Trend Service');
    }

    getIncentivePayoutPages(vendorId: string | undefined, monthId: string | undefined, batchName: string | undefined): Observable<PayoutPages> {
        return this.http
            .get<PayoutPages>(this.incentivePayoutPageURL + vendorId + '?month_id=' + monthId + '&batch_name=' + batchName, httpOptions)
            .pipe(catchError(this.handleError<PayoutPages>('GetIncentivePayoutPages')));
    }

    getIncentivePayoutPageDetails(request: PayoutPagesDetailRequest): Observable<PayoutPagesDetails> {
        return this.http
            .post<PayoutPagesDetails>(this.incentivePayoutPageDetailsURL, request, httpOptions)
            .pipe(catchError(this.handleError<PayoutPagesDetails>('GetIncentivePayoutPageDetails')));
    }

    getIncentiveReportDetails(incentiveType: string | undefined, monthId: string | undefined, vendorId: string | undefined): Observable<IncentiveReportDetails> {
        return this.http
            .get<IncentiveReportDetails>(this.incentiveReportDetailsURL + '?incentive_type=' + incentiveType + '&month_id=' + monthId + '&vendor_id=' + vendorId, httpOptions)
            .pipe(catchError(this.handleError<IncentiveReportDetails>('GetIncentiveReportDetails')));
    }

    downloadEligibleAndIneligiblePayoutDetails(downloadPath: string) {
        return this.http
            .get(`${this.incentiveEligibleAndIneligiblePayoutDetailsURL}?path=` + "'" + downloadPath  + "'", {
                headers: httpOptions.headers,
                observe: 'response',
                responseType: 'blob',
            })
    }

    downloadPaymentAdvice(pay_adv_guid: string, vendor_id:string | undefined) {
        return this.http
            .get(`${this.incentiveReportPaymentAdvice}${vendor_id}/payment-advice/${pay_adv_guid}`, {
                headers: httpOptions.headers,
                observe: 'response',
                responseType: 'blob',
            })
    }
}
