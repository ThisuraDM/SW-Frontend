import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Key } from 'angular-feather/icons';
import { BcViewStockTransferDetailsBcToBc } from '../models/bc-view-stock-transfer-details-bc-to-bc';

import * as InventoryStoreDetails from './../state/inventory-data-action'
import * as AppState from './app-state';

export interface State extends AppState.State {
    stockTransferDetail: BcViewStockTransferDetailsBcToBc
}

export interface InventoryState {
    stockTransferDetail: BcViewStockTransferDetailsBcToBc
}

const initialState: InventoryState = {
    stockTransferDetail: {
        approved_date: '',
        approved_user: '',
        create_date: '',
        create_user: '',
        destination_outlet_name: '',
        destination_outlet_store_id: '',
        enable_acknowledge: false,
        enable_approve_reject: false,
        enable_transfer_serial: false,
        item_details: [],
        last_status_updated_date: '',
        last_status_updated_by:'',
        origin_outlet_name: '',
        origin_outlet_store_id: '',
        remarks: '',
        request_id: '',
        serial_product: null,
        status: '',
        transfer_date: '',
        transfer_user: ''
    }

};

const _inventoryReducer = createReducer(
    initialState,
    on(InventoryStoreDetails.setstockTransferDetails, (state, action) => {
        return {
            ...state,
            stockTransferDetail: action.input,
        };
    }),
    on(InventoryStoreDetails.setItemDetails, (state, action) => {
        return {
            ...state,
            stockTransferDetail: {
                ...state.stockTransferDetail,
                item_details: action.input
            },
        };
    }),
    on(InventoryStoreDetails.setstockSerielNumbers, (state, { sapCode, isVerified, serialList }) => {
        return {
            ...state,
            stockTransferDetail: {
                ...state.stockTransferDetail,
                item_details: {
                    ...state.stockTransferDetail.item_details?.map(
                        item => (item.sap_material_code === sapCode) ?
                       {
                        ...item,
                        added_serial_numbers: serialList,
                        isVerified
                       }
                       : item
                    ),

                }


            },
        };
    }),
    on(InventoryStoreDetails.setAcknowledgeTransferDetails, (state, action) => {
        return {
            ...state,
            stockTransferDetail: action.input,
        };
    }),
    on(InventoryStoreDetails.setAcknowledgeItemDetails, (state, action) => {
        return {
            ...state,
            stockTransferDetail: {
                ...state.stockTransferDetail,
                item_details: action.input
            },
        };
    }),
    on(InventoryStoreDetails.setAcknowledgeSerielNumbers, (state, { sapCode, isVerified, serialList}) => {
        return {
            ...state,
            stockTransferDetail: {
                ...state.stockTransferDetail,
                item_details: {
                    ...state.stockTransferDetail.item_details?.map(
                        item => (item.sap_material_code === sapCode) ?
                       {
                        ...item,
                        added_serial_numbers: serialList,
                        isVerified
                       }
                       : item
                    ),

                }


            },
        };
    }),

);

export const inventoryReducer = (state: any, action: any) => {
    return _inventoryReducer(state, action);
};