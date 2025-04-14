import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { SatisfactionSurveyHttpService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey-http.service';
import { SurveySettings } from '@app/SW-layout/satisfaction-survey/models/survey-details';
import { SURVEY_SETTINGS } from '../../../../constants/SurveyModuleSettings';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/auth/services/auth.service';


@Injectable({
    providedIn: 'root',
})
export class SatisfactionSurveyService {

    moduleId: string = '1';
    showSurveyPopup: boolean = false;
    surveySettings = SURVEY_SETTINGS;
    logOutWhenClose: boolean = false;
    constructor(private modalService: NgbModal,
                public authService: AuthService,
                private localStorageService: LocalStorageService,
                private satisfactionSurveyHttpService: SatisfactionSurveyHttpService) {
    }

    onFinishSurvey(event: any) {
        this.modalService.dismissAll();
        this.showSurveyPopup = false;
        if (this.logOutWhenClose) {
            this.authService.logout();
        }
    }

    show(surveyId: string, logOutWhenClose?: boolean) {
        this.logOutWhenClose =  logOutWhenClose == undefined? false: logOutWhenClose;
        let surveySetting: SurveySettings = this.getSurveySettingById(surveyId)
        const isEligible: boolean = this.localStorageService.getSurvey(surveySetting.id);
        const moduleId: string = surveySetting.moduleId;
        if (isEligible) {
            this.showSurveyPopup = isEligible;
            this.moduleId = moduleId
        } else {
            this.createEligibilityToAndUser(moduleId)
        }
    }

    createEligibilityToAndUser(moduleId: string) {
        this.satisfactionSurveyHttpService.createEligibilityToAndUser(
            this.localStorageService.getUserLoginName(), moduleId)
            .subscribe(value => {
                console.log('Successfully eligibility created!!');
                this.satisfactionSurveyHttpService.getUserSurveyDetails(this.localStorageService.getUserLoginName())
                    .subscribe(response => {
                        if (response) {
                            this.localStorageService.setSurvey(response);
                        }
                    });
            });
    }

    getSurveySettingById(surveyId: string) {
        return this.surveySettings.filter(value => value.id === surveyId)[0];
    }

    triggerLoginAndKPISurvey() {
        let userType;
        if (this.localStorageService.getRefreshToken() === null) {
            userType = 0;
        } else {
            userType = 1;
        }
        if (userType === 0) {
            if (this.localStorageService.getSurvey('LOGIN')) {
                this.show('LOGIN');
                return;
            } else {
                this.createEligibilityToAndUser(this.getSurveySettingById('LOGIN').moduleId);
            }

            // if (this.localStorageService.getSurvey('KPI')) {
            //     this.show('KPI');
            //     return;
            // } else {
            //     this.createEligibilityToAndUser(this.getSurveySettingById('KPI').moduleId);
            // }
        } else {
            if (this.localStorageService.getSurvey('LOGIN_BC')) {
                this.show('LOGIN_BC');
                return;
            } else {
                this.createEligibilityToAndUser(this.getSurveySettingById('LOGIN_BC').moduleId);
            }

            if (this.localStorageService.getSurvey('KPI_BC')) {
                this.show('KPI_BC');
                return;
            } else {
                this.createEligibilityToAndUser(this.getSurveySettingById('KPI_BC').moduleId);
            }
        }
    }
}
