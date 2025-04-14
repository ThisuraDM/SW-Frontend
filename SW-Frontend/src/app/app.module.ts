import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SWLayoutComponent } from '@app/SW-layout/SW-layout.component';
import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { BrowserCacheLocation, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MomentModule } from 'angular2-moment';
import { environment } from 'environments/environment';
import { urlConfigReducer } from 'state/url-configs-reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NgxMaskModule } from 'ngx-mask';
import { AuthInterceptor } from '../services/auth.interceptor';
import { SatisfactionSurveyModule } from '@app/SW-layout/satisfaction-survey/satisfaction-survey.module';

export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: `${environment.msAdClientId}`,
            authority: 'https://login.microsoftonline.com/SWo365.onmicrosoft.com',
            redirectUri: `${environment.redirect}`,
            postLogoutRedirectUri: `${environment.logoutRedirect}`
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: true, // set to true for IE 11
        },
    });
}

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        AppCommonModule.forRoot(),
        NavigationModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        NgxMaskModule.forRoot(),
        MomentModule,
        MsalModule,
        StoreModule.forRoot({ params: urlConfigReducer }),
        StoreDevtoolsModule.instrument({
            name: 'APM Demo App DevTools',
            maxAge: 25,
            logOnly: environment.production,
        }), FormsModule, ReactiveFormsModule, AuthModule, SatisfactionSurveyModule,
    ],
    declarations: [AppComponent, SWLayoutComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory,
        },
        MsalService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
