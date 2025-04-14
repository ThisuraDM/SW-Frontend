import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    PayoutPerformanceSummaryDetails,
    PayoutSummaryDetailsPlans,
    PayoutTrendCategoryNames,
    PayoutTrendChartResponse,
    PayoutTrendSchemaNames,
} from '@app/SW-layout/incentive/models/dealer-incentive-payout-trend';
import { SWIncentiveData } from '@app/SW-layout/incentive/models/incentive-info-card';
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
export class DealerIncentivePayoutTrendService {

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Daily Trend Service');
    }

    private readonly handleError: HandleError;
    private incentivePayoutSummaryDetailsURL = `${environment.baseUrl}/outlet/payout-performance-details/get-payout-performance-summary-details`;
    private incentivePayoutSummaryPackagePlanesURL = `${environment.baseUrl}/outlet/incentive/payout-performance-summary`;
    private incentivePayoutAvailableListOfPackagePlans = `${environment.baseUrl}/outlet/incentive/payout-performance-summary`;
    private incentivePayoutTrendSchemaNamesURL = `${environment.baseUrl}/outlet/incentive/payout-trend-list-of-schema-names`;
    private incentivePayoutTrendCategoryNamesURL = `${environment.baseUrl}/outlet/payout-trend-category-names/get-names`;
    private incentivePayoutTrendChartURL = `${environment.baseUrl}/outlet/incentive/payout-trend-bar-chart/`

    getIncentivePayoutReportSummaryDetails(request: SWIncentiveData): Observable<PayoutPerformanceSummaryDetails> {
        return this.http
            .post<PayoutPerformanceSummaryDetails>(this.incentivePayoutSummaryDetailsURL, request, httpOptions)
            .pipe(catchError(this.handleError<PayoutPerformanceSummaryDetails>('GetIncentivePayoutReportSummaryDetails')));
    }

    getIncentivePayoutReportSummaryPackagePlanes(category?:string,month_id?:string,scheme_name?:string,vendor_id?:string): Observable<PayoutSummaryDetailsPlans> {
        return this.http
            .get<PayoutSummaryDetailsPlans>(`${this.incentivePayoutSummaryPackagePlanesURL}/${vendor_id}/package-plans?category=${category}&month_id=${month_id}&scheme_name=${scheme_name}`, httpOptions)
            .pipe(catchError(this.handleError<PayoutSummaryDetailsPlans>('GetIncentivePayoutReportSummaryPackagePlanes')));
    }

    downloadIncentivePayoutAvailableListOfPackagePlans(category?:string | undefined,month_id?:string | undefined,scheme_name? :string | undefined,vendor_id?:string | undefined) {
        return this.http
            .get(`${this.incentivePayoutAvailableListOfPackagePlans}/${vendor_id}/package-plans/download?category=${category}&month_id=${month_id}&scheme_name=${scheme_name}`, {
                headers: httpOptions.headers,
                observe: 'response',
                responseType: 'blob'
            });
    }

    getIncentivePayoutTrendSchemaNames(category:string,month_id:string,months:number,vendor_id:string): Observable<PayoutTrendSchemaNames> {
        return this.http
            .get<PayoutTrendSchemaNames>(`${this.incentivePayoutTrendSchemaNamesURL}?category=${category}&month_id=${month_id}&months=${months}&vendor_id=${vendor_id}`, httpOptions)
            .pipe(catchError(this.handleError<PayoutTrendSchemaNames>('getIncentivePayoutTrendSchemaNames')));
    }

    getIncentivePayoutTrendCategoryNames(month_id:string,numberOfMonths:number,vendor_id:string): Observable<PayoutTrendCategoryNames> {
        const request = {
            months: numberOfMonths,
            payout_month_id: month_id,
            vendor_id,
        }
        return this.http
            .post<PayoutTrendCategoryNames>(this.incentivePayoutTrendCategoryNamesURL, request, httpOptions)
            .pipe(catchError(this.handleError<PayoutTrendCategoryNames>('getIncentivePayoutTrendCategoryNames')));
    }

    getIncentivePayoutTrendChart(month_id:string,numberOfMonths:number,vendor_id:string,schema:string,incentiveType:string):
    Observable<PayoutTrendChartResponse[]> {
        const request = {
            incentive_type: incentiveType,
            months: numberOfMonths,
            schema_name:schema,
        }
        return this.http
            .post<PayoutTrendChartResponse[]>
            (`${this.incentivePayoutTrendChartURL}${vendor_id}?month_id=${month_id}`, request, httpOptions)
            .pipe(catchError(this.handleError<PayoutTrendChartResponse[]>('getIncentivePayoutTrendCategoryNames')));
    }

}
