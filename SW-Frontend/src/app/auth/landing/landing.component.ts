import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { URLConfigState } from 'state/url-configs-reducer';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'SW-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
    disableDealerButton = true;
    page = 'landing'
    smFromTime = ''
    smToTime = ''
    @ViewChild('modalLoading', { static: true }) loadingPopup!: TemplateRef<any>;

    constructor(private router: Router,
        private modalService: NgbModal,
        private msalService: MsalService,
        private store: Store<{ params: URLConfigState }>) {
    }

    ngOnInit(): void {
        this.store.select('params').subscribe((data) => {
            const disableDealerLogin = data.urlConfigs.disable_dealer_login;
            const plannedMaintenance = data.urlConfigs.is_planned_maintenance;
            const suddenDowntime = data.urlConfigs.is_sudden_downtime;
            this.disableDealerButton = disableDealerLogin
            this.smFromTime = data.urlConfigs.maintenance_start_time;
            this.smToTime = data.urlConfigs.maintenance_end_time;

            if (data.urlConfigs.base_url !== '') {
                if (plannedMaintenance) {
                    this.page = 'planned'
                } else if (suddenDowntime) {
                    this.page = 'sudden'
                } else {
                    this.page = 'landing'
                }
            }
        });

        const hasVisitedBefore = sessionStorage.getItem('visitedLandingPage');
        if (hasVisitedBefore == 'true') {
            const account = this.msalService.instance.getActiveAccount();
            if(!account){
                this.modalService.open(this.loadingPopup, { centered: true, size: 'md',backdrop: 'static' });
                sessionStorage.setItem('visitedLandingPage', 'false');
            }    
        } 
    }

    loadAuthUrl = () => {
        sessionStorage.setItem('visitedLandingPage', 'true');
        if (!this.disableDealerButton) {
            // this.router.navigate(['/auth-common/dealer'])
            const msUrl = `${environment.b2cRedirect}`;
            window.open(msUrl, '_self');
        }
    };

    toCustomBcLogin = () => {
        this.router.navigate(['/auth-common/bc']);
    };


    loginWithAd = () => {
        sessionStorage.setItem('visitedLandingPage', 'true');
        const loginRequest = {
            scopes: ['user.read', 'mail.send'], // optional Array<string>
        };

        // Check if user signed in
        const account = this.msalService.instance.getActiveAccount();
        if (!account) {
            // redirect anonymous user to login page
            this.msalService.instance.loginRedirect(loginRequest);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
}
