import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HandleError, HttpErrorHandler } from '../../../../services/http-error-handler.service';
import { BlueCubeProducts, Products } from '../models/products';

/**
 * SW product service
 * Author: Thisura Munasinghe
 * Created Date: 2021 July 7
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
export class ProductsService {
    baseUrl = `${environment.baseUrl}/kpi/`;

    private handleError: HandleError;

    constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('Products Service');
    }

    /** GET BlueCube Products from the server */
    getProducts(): Observable<Products[]> {
        return this.http
            .get<Products[]>(this.baseUrl + 'bluecube/products', httpOptions)
            .pipe(catchError(this.handleError<Products[]>('getProducts')));
    }

    /** GET Dealer Products from the server */
    getBlueCubeProducts(): Observable<BlueCubeProducts[]> {
        return this.http
            .get<BlueCubeProducts[]>(this.baseUrl + 'dealer/products', httpOptions)
            .pipe(catchError(this.handleError<BlueCubeProducts[]>('getProducts')));
    }
}
