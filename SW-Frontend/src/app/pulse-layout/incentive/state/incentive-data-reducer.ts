import { createReducer, on } from '@ngrx/store';

import * as IncentiveStoreDetails from './../state/actions/incentive-data-action';
import * as AppState from './app-state';

export interface State extends AppState.State {
    category: string,
    month_label:string,
    payment_batch_name:string,
    payout_month_id:string,
    vendor_id:string,
    scheme_name:string
}

export interface IncentiveState {
    category: string,
    month_label:string,
    payment_batch_name:string,
    payout_month_id:string,
    vendor_id:string,
    scheme_name:string
}

const initialState: IncentiveState = {
        category:'',
        month_label:'',
        payment_batch_name:'',
        payout_month_id:'',
        vendor_id:'',
        scheme_name:'',
};

const _incentiveReducer = createReducer(
    initialState,
    on(IncentiveStoreDetails.setIncentiveStoreVendorId, (state, action) => {
        return {
            ...state,
            vendor_id: action.input,
        };
    }),
    on(IncentiveStoreDetails.setIncentiveStoreMonthId, (state, action) => {
        return {
            ...state,
            payout_month_id: action.input,
        };
    }),
    on(IncentiveStoreDetails.setIncentiveStoreMonthName, (state, action) => {
        return {
            ...state,
            month_label: action.input,
        };
    }),
    on(IncentiveStoreDetails.setIncentiveStoreCategory, (state, action) => {
        return {
            ...state,
            category: action.input,
        };
    }),
    on(IncentiveStoreDetails.setIncentiveStorePaymentBatchName, (state, action) => {
        return {
            ...state,
            payment_batch_name: action.input,
        };
    }),
    on(IncentiveStoreDetails.setIncentiveStoreSchemeName, (state, action) => {
        return {
            ...state,
            scheme_name: action.input,
        };
    })
);

export const incentiveReducer = (state: any, action: any) => {
    return _incentiveReducer(state, action);
};



