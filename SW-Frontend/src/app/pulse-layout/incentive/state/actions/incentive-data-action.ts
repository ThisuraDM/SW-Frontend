/* NGRX  */
import { createAction, props } from '@ngrx/store';

export const setIncentiveStoreMonthId = createAction(
    '[incentive-data] Set  Incentive Store Month ID',
    props<{ input: string }>()
);

export const setIncentiveStoreMonthName= createAction(
    '[incentive-data] Set  Incentive Store Month Name',
    props<{ input: string }>()
);

export const setIncentiveStoreVendorId = createAction(
    '[incentive-data] Set  Incentive Store Vendor ID',
    props<{ input: string }>()
);

export const setIncentiveStoreCategory = createAction(
    '[incentive-data] Set  Incentive Store Category',
    props<{ input: string }>()
);

export const setIncentiveStorePaymentBatchName = createAction(
    '[incentive-data] Set  Incentive Payment Batch Name',
    props<{ input: string }>()
);

export const setIncentiveStoreSchemeName = createAction(
    '[incentive-data] Set  Incentive Scheme Name',
    props<{ input: string }>()
);
