import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { UserService } from '@modules/auth/services';
import { Store } from '@ngrx/store';
import { StorageSettings } from 'constants/StorageSettings';
import { environment } from 'environments/environment';
import { LocalStorageService } from 'services/local-storage.service';
import { URLConfigState } from 'state/url-configs-reducer';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'sbpro-top-nav-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './top-nav-user.component.html',
    styleUrls: ['top-nav-user.component.scss'],
})
export class TopNavUserComponent implements OnInit {
    @Input() placement = 'bottom-end';
    dropdownClasses: string[] = [];
    public username = '';
    public email = '';
    public allowPasswordChange = false;
    public disableRedirect = false

    constructor(
        public userService: UserService,
        public authService: AuthService,
        private localStorageService: LocalStorageService,
        private satisfactionSurveyService: SatisfactionSurveyService,
        private store: Store<{ params: URLConfigState }>
    ) { }
    ngOnInit() {
        this.setUserDetails();
        this.store.select('params').subscribe((data) => {
            const disableRe = data.urlConfigs.disable_redirect;
            this.disableRedirect = disableRe
        });
        if (this.localStorageService.getPermissions().includes('SELF_PW_RESET')) {
            this.allowPasswordChange = true
        }
    }

    setUserDetails() {
        const nameString = localStorage.getItem(StorageSettings.NAME);
        const emailString = localStorage.getItem(StorageSettings.EMAIL);
        if (nameString != null) {
            this.username = nameString;
        }
        if (emailString != null) {
            this.email = emailString;
        }
    }

    onClickChangePassword = () => {
        const loginName = localStorage.getItem(StorageSettings.LOGIN_NAME);
        this.localStorageService.clear();
        const msUrl = environment.selfPwReset + '&signInName=' + loginName;
        window.open(msUrl, '_self');
    }

    onLogout() {
        if (this.localStorageService.getRefreshToken() == null) {
            if (this.localStorageService.getSurvey('LOGIN')) {
                this.satisfactionSurveyService.show('LOGIN', true);
                // } else if (this.localStorageService.getSurvey("KPI")) {
                //     this.satisfactionSurveyService.show('KPI');
            } else {
                this.logout();
            }
        } else {
            if (this.localStorageService.getSurvey('LOGIN_BC')) {
                this.satisfactionSurveyService.show('LOGIN_BC', true);
            } else if (this.localStorageService.getSurvey('KPI_BC')) {
                this.satisfactionSurveyService.show('KPI_BC', true);
            } else {
                this.logout();
            }
        }
    }

    logout() {
        this.authService.logout();
    }
}
