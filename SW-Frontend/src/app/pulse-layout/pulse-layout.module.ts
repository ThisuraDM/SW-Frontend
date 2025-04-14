import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SWDashboardModule } from '@app/SW-layout/dashboard/SW-dashboard.module';
import { StoreModule } from '@app/SW-layout/store/store.module';

import { urlConfigReducer } from '../../state/url-configs-reducer';
import { SatisfactionSurveyModule } from './satisfaction-survey/satisfaction-survey.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SWDashboardModule,
        StoreModule,
        SatisfactionSurveyModule,
        StoreModule.forFeature({ urlConfigReducer }),
    ],
})
export class SWLayoutModule {}
