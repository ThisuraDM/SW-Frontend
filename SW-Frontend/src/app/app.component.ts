import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { UrlConfigApiActions } from 'state/actions';

import { LocalStorageService } from '../services/local-storage.service';
import { UrlConfigService } from '../services/url-config-service';
import { State } from '../state/url-configs-reducer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    constructor(
        private msalService: MsalService,
        private modalService: NgbModal,
        private localStorageService: LocalStorageService,
        private router: Router,
        private urlConfigService: UrlConfigService,
        private store: Store<State>
    ) {}

    ngOnInit() {
        this.getUrlConfigs();

        this.msalService.instance.handleRedirectPromise().then((res) => {
            // set Id token and the active account from the promise
            if (res !== null && res.account !== null) {
                this.msalService.instance.setActiveAccount(res.account);
                this.localStorageService.setToken(res.accessToken);
                this.localStorageService.setUserName(res.account.username);
                let refreshTokenKeyRef: any;
                    Object.keys(localStorage).forEach(function(key){
                    if(key.includes('login.windows.net-refreshtoken')){
                        refreshTokenKeyRef = key;
                    }
                });
                let refreshTokenData: any = this.localStorageService.getRefreshTokenData(refreshTokenKeyRef);
                this.localStorageService.add("refresh-token-key", refreshTokenKeyRef, false);
                this.localStorageService.setRefreshToken(JSON.parse(refreshTokenData).secret);
                this.router.navigate(['/dashboard']);
            }
        });
    }
    getUrlConfigs() {
        this.urlConfigService.getUrlConfigs().subscribe((response) => {
            if (response) {
                this.store.dispatch(UrlConfigApiActions.setURLConfigDetails({ input: response }));
            }
        });
    }
}
