import { Injectable } from '@angular/core';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TemplateModel } from './template-model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
    }),
};

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    baseUrl = 'localhost:80/template';
    private handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('templatesService');
    }

    /** GET templates from the server */
    getTemplate(): Observable<TemplateModel[]> {
        return this.http.get<TemplateModel[]>(this.baseUrl)
            .pipe(
                catchError(this.handleError('getTemplate', []))
            );
    }

    /** GET templates whose name contains search term */
    searchTemplate(term: string): Observable<TemplateModel[]> {
        term = term.trim();

        // Add safe, URL encoded search parameter if there is a search term
        const options = term ?
            { params: new HttpParams().set('name', term) } : {};

        return this.http.get<TemplateModel[]>(this.baseUrl, options)
            .pipe(
                catchError(this.handleError<TemplateModel[]>('searchTemplate', []))
            );
    }

    /** POST: add a new template-model.ts to the database */
    addTemplate(template: TemplateModel): Observable<TemplateModel> {
        return this.http.post<TemplateModel>(this.baseUrl, template, httpOptions)
            .pipe(
                catchError(this.handleError('addTemplate', template))
            );
    }

    /** DELETE: delete the template-model.ts from the server */
    deleteTemplate(id: number): Observable<unknown> {
        const url = `${this.baseUrl}/${id}`; // DELETE api/templates/42
        return this.http.delete(url, httpOptions)
            .pipe(
                catchError(this.handleError('deleteTemplate'))
            );
    }

    /** PUT: update the template-model.ts on the server. Returns the updated Template upon success. */
    updateTemplate(template: TemplateModel): Observable<TemplateModel> {
        httpOptions.headers =
            httpOptions.headers.set('Authorization', 'my-new-auth-token');

        return this.http.put<TemplateModel>(this.baseUrl, template, httpOptions)
            .pipe(
                catchError(this.handleError('updateTemplate', template))
            );
    }
}
