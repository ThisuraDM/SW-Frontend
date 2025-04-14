/* NGRX  */
import { createAction, props } from '@ngrx/store';

import { UrlConfig } from '../../models/config-url';

export const setURLConfigDetails = createAction(
    '[url-config] Set URL Config Details',
    props<{ input: UrlConfig }>()
);
