import { createAction, props } from '@ngrx/store';
import {
    BcViewStockTransferDetailsBcToBc, StockTransferItemDetails,
} from './../models/bc-view-stock-transfer-details-bc-to-bc'; 

export const setstockTransferDetails = createAction(
    '[inventory-data] Set Stock Transfer Details',
    props<{ input: BcViewStockTransferDetailsBcToBc }>()
);
export const setItemDetails = createAction(
    '[inventory-data] Set Item Details',
    props<{ input: StockTransferItemDetails[] }>()
);

export const setstockSerielNumbers = createAction(
    '[inventory-data] Set Stock SerielNumber Details',
    props<{ sapCode: string,isVerified:boolean,serialList:string[]}>()
);

export const setAcknowledgeTransferDetails = createAction(
    '[inventory-data] Set Acknowledge Transfer Details',
    props<{ input: BcViewStockTransferDetailsBcToBc }>()
);
export const setAcknowledgeItemDetails = createAction(
    '[inventory-data] Set Acknowledge Item Details',
    props<{ input: StockTransferItemDetails[] }>()
);

export const setAcknowledgeSerielNumbers = createAction(
    '[inventory-data] Set Acknowledge SerielNumber Details',
    props<{ sapCode: string,isVerified:boolean,serialList:string[]}>()
);