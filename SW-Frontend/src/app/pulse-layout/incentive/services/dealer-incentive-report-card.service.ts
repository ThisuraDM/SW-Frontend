import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class DealerIncentiveReportCardService {

    private readonly handleError: HandleError;
    private incentiveC58TaxFormURL = `${environment.baseUrl}/outlet/incentive/C58-tax-form`;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Daily Trend Service');
    }

    downloadC58TaxForm(vendorId: string, selectedTaxForm: string) {
        return this.http
            .get(this.incentiveC58TaxFormURL + '?vendor_id=' + vendorId + '&year=' + selectedTaxForm, {
                observe: 'response',
                responseType: 'blob',
            });
    }
}
