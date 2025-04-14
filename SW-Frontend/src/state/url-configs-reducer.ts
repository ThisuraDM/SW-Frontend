import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { UrlConfig } from '../models/config-url';

import { UrlConfigApiActions } from './actions';
import * as AppState from './app-state';

export interface State extends AppState.State {
    urlConfigState: URLConfigState;
}

export interface URLConfigState {
    urlConfigs: UrlConfig;
}



const initialState: URLConfigState = {
    urlConfigs: {
        b2c_redirect : '',
        payment_gateway: '',
        ad_redirect: '',
        ad_ms_clientId:'',
        ad_ms_authority:'',
        base_url:'',
        disable_dealer_login: true,
        disable_redirect: true,
        is_planned_maintenance:false,
        is_sudden_downtime:false,
        maintenance_start_time:'',
        maintenance_end_time:''
    },
};

const _urlConfigReducer = createReducer(
    initialState,
    on(UrlConfigApiActions.setURLConfigDetails, (state, action) => {
        return {
            ...state,
            urlConfigs: action.input,
        };
    })
);

export const urlConfigReducer = (state: any, action: any) => {
    return _urlConfigReducer(state, action);
};
