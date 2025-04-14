import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from 'services/http-error-handler.service';

import { Categories } from '../models/incentive-report';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token',
  }),
};
@Injectable({
  providedIn: 'root'
})
export class IncentiveReportService {

  private baseurlGetCategories = `${environment.baseUrl}/outlet/incentive/payout-performance-summary-category-names/`;

  private readonly handleError: HandleError;
  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
  ) {
    this.handleError = httpErrorHandler.createHandleError('Dealer Incentive Report');
  }

  getCategories(vendor_id: string, month: string): Observable<Categories> {
    return this.http
      .get<Categories>(`${this.baseurlGetCategories}${vendor_id}?month_id=${month}`)
      .pipe(catchError(this.handleError<Categories>('getCategories')));
  }

}
