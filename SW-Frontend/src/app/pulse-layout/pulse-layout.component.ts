import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { URLConfigState } from 'state/url-configs-reducer';

import { LocalStorageService } from '../../services/local-storage.service';
import { SatisfactionSurveyHttpService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey-http.service';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'SW-SW-app',
    templateUrl: './SW-layout.component.html',
    styleUrls: ['./SW-layout.component.scss'],
})
export class SWLayoutComponent implements OnInit {
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = new Date();
    title = 'SW BO';
    isConfirmButtonVisible = true;
    isLabelVisible = true;
    isLogoutButtonVisible = true;
    isLoginButtonVisible = false;
    isTimeout = false;
    description =
        'This page will expire unless a response is made within 2 minutes. Click continue to prevent expiration';
    popupTitle = 'Warning Idle';

    // tslint:disable-next-line: no-any
    @ViewChild('modalIdle', { static: true }) content!: TemplateRef<any>;

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        public router: Router,
        private titleService: Title,
        private http: HttpClient,
        private idle: Idle,
        private keepalive: Keepalive,
        private modalService: NgbModal,
        private satisfactionSurveyHttpService: SatisfactionSurveyHttpService,
        private satisfactionSurveyService: SatisfactionSurveyService,
        private store: Store<{ params: URLConfigState }>,
    ) {
        this.router.events
            .pipe(filter((event) => event instanceof ChildActivationEnd))
            .subscribe((event) => {
                let snapshot = (event as ChildActivationEnd).snapshot;

                while (snapshot.firstChild !== null) {
                    snapshot = snapshot.firstChild;
                }
                this.titleService.setTitle(snapshot.data.title || 'SB Admin Pro Angular');
            });

        this.setIdle();
    }

    ngOnInit(): void {
        this.satisfactionSurveyHttpService.getUserSurveyDetails(this.localStorageService.getUserLoginName()).subscribe(response => {
            this.localStorageService.setSurvey(response);
            this.satisfactionSurveyService.triggerLoginAndKPISurvey();
        });
    }

    setIdle() {
        // sets an idle timeout of 5 seconds, for testingx purposes.
        this.idle.setIdle(600);
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        this.idle.setTimeout(120);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleEnd.subscribe(() => {
            this.idleState = 'No longer idle.';

            this.reset();
        });

        this.idle.onTimeout.subscribe(() => {
            this.idleState = 'Timed out!';
            this.timedOut = true;
            this.isTimeout = true;
            this.isConfirmButtonVisible = false;
            this.isLoginButtonVisible = true;
            this.isLogoutButtonVisible = false;
            this.isLabelVisible = false;
            this.description =
                'You were not clicking around any more, so we logged you out for your protection. To get back in, just login again';
            this.popupTitle = 'Session Timeout';

            this.localStorageService.clear();
            this.location.replaceState('/auth-landing');
        });

        this.idle.onIdleStart.subscribe(() => {
            this.idle.clearInterrupts();
            this.idleState = 'You have gone idle!';
            const ngbModalOptions: NgbModalOptions = {
                backdrop: 'static',
                keyboard: false,
            };
            this.modalService.open(this.content, ngbModalOptions);
        });

        this.idle.onTimeoutWarning.subscribe((countdown) => {
            this.idleState = 'You will time out in ' + countdown + ' seconds!';
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        this.keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

        this.reset();
    }

    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    onContinueClick() {
        this.modalService.dismissAll();
        this.setIdle();
    }

    logout() {
        this.modalService.dismissAll();
        this.authService.logout();
    }
}
