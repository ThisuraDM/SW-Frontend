import { Injectable } from '@angular/core';

import { StorageSettings } from '../constants/StorageSettings';
import { SurveyDetails } from '@app/SW-layout/satisfaction-survey/models/survey-details';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    add(key: string, value: any, stringify: boolean) {
        if (stringify) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    get(key: string) {
        const item = localStorage.getItem(key);
        if (item !== null) {
            return item;
        }
        return '';
    }

    clear() {
        localStorage.clear();
    }

    isLogin() {
        const permissions = localStorage.getItem(StorageSettings.PERMISSIONS);
        if (permissions != null) {
            return true;
        }
        return false;
    }

    getToken() {
        return localStorage.getItem(StorageSettings.TOKEN);
    }

    setToken(token: string) {
        localStorage.setItem(StorageSettings.TOKEN, token);
    }

    getRefreshTokenData(key: string) {
        return localStorage.getItem(key);
    }

    getRefreshToken() {
        return localStorage.getItem(StorageSettings.REFRESH_TOKEN);
    }

    setRefreshToken(token: string) {
        localStorage.setItem(StorageSettings.REFRESH_TOKEN, token);
    }

    getUserLoginName() {
        return localStorage.getItem(StorageSettings.LOGIN_NAME);
    }

    getUserName() {
        return localStorage.getItem(StorageSettings.USERNAME);
    }

    setUserName(name: string) {
        localStorage.setItem(StorageSettings.USERNAME, name);
    }

    getOutlets() {
        const outlets = localStorage.getItem(StorageSettings.OUTLETS);
        if (outlets != null) {
            return JSON.parse(outlets);
        }
        return null;
    }

    setOutlets(outlets: any) {
        localStorage.setItem(StorageSettings.OUTLETS, JSON.stringify(outlets));
    }

    getRegionAndOutlets() {
        const region = localStorage.getItem(StorageSettings.REGION_AND_OUTLETS);
        if (region != null) {
            return JSON.parse(region);
        }
        return null;
    }

    setRegionAndOutlets(region: any) {
        localStorage.setItem(StorageSettings.REGION_AND_OUTLETS, JSON.stringify(region));
    }

    getPermissions() {
        const permissions = localStorage.getItem(StorageSettings.PERMISSIONS);
        if (permissions != null) {
            return JSON.parse(permissions);
        }
        return null;
    }

    setPermissions(permission: any) {
        localStorage.setItem(StorageSettings.PERMISSIONS, JSON.stringify(permission));
    }
    
    getRestrictedPermissions() {
        const permissions = localStorage.getItem(StorageSettings.RESTRICTED_PERMISSIONS);
        if (permissions != null) {
            return JSON.parse(permissions);
        }
        return null;
    }

    setRestrictedPermissions(permission: any) {
        localStorage.setItem(StorageSettings.RESTRICTED_PERMISSIONS, JSON.stringify(permission));
    }

    isDealerOwner() {
        const permissions = localStorage.getItem(StorageSettings.PERMISSIONS);
        if (permissions != null) {
            if (permissions.includes('EWALLET_CASH_IN')) {
                return true;
            }
            return false;
        }
        return false;
    }

    isBCUser() {
        const permissions = localStorage.getItem(StorageSettings.PERMISSIONS);
        if (permissions != null) {
            if (permissions.includes('KPI_DASHBOARD_DEALER')) {
                return false;
            }
            return true;
        }
        return true;
    }

    setSurvey(servey: any) {
        const survey = localStorage.setItem('survey', JSON.stringify(servey));
    }

    getSurvey(name: string): boolean {
        const survey = localStorage.getItem('survey');
        let result: boolean = false;
        if (survey != null) {
            let details: SurveyDetails[] = JSON.parse(survey);
            if (details != null) {
                details.forEach(value => {
                    if (!value.has_complete) {
                        if (value.id.surveyModule.module_name === name) {
                            result = true;
                            return result;
                        }
                    }
                });
            }
        }
        return result;
    }

    getSessionId() {
        return localStorage.getItem(StorageSettings.SESSION_ID);
    }

    setSessionId(sessionId: string) {
        localStorage.setItem(StorageSettings.SESSION_ID, sessionId);
    }
}
