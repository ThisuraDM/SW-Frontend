import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AppCommonModule } from '../../../modules/app-common/app-common.module';
import { ChartsModule } from '../../../modules/charts/charts.module';
import { NavigationModule } from '../../../modules/navigation/navigation.module';
import { SWCommonModule } from '../../SW/SW-common/SW-common.module';

import {incentiveReducer} from './../incentive/state/incentive-data-reducer';
import {
    IncentiveInfoPieChartComponent,
} from './components/charts/incentive-info-pie-chart/incentive-info-pie-chart.component';
import {
    IncentiveAnnouncementCardComponent,
} from './components/incentive-announcement-card/incentive-announcement-card.component';
import {
    IncentiveDisputeManagementComponent,
} from './components/incentive-dispute-management/incentive-dispute-management.component';
import { IncentiveFilterBoxComponent } from './components/incentive-filter-box/incentive-filter-box.component';
import { IncentiveInfoCardComponent } from './components/incentive-info-card/incentive-info-card.component';
import {
    IncentivePayoutHistoryComponent,
} from './components/incentive-payout-history/incentive-payout-history.component';
import { IncentivePayoutTrendComponent } from './components/incentive-payout-trend/incentive-payout-trend.component';
import {
    IncentivePayoutTrendsListComponent,
} from './components/incentive-payout-trends-list/incentive-payout-trends-list.component';
import { IncentiveReportCardComponent } from './components/incentive-report-card/incentive-report-card.component';
import { IncentiveTotalCardComponent } from './components/incentive-total-card/incentive-total-card.component';
import { MainCategoryCardComponent } from './components/main-category-card/main-category-card.component';
import {
    PrepaidIncentiveReportComponent,
} from './components/prepaid-incentive-report/prepaid-incentive-report.component';
// import { PayoutPageComponent } from './payout-page/payout-page.component';
import { ViewPayoutComponent } from './components/view-payout/view-payout.component';
import {
    DealerIncentiveContainerComponent,
} from './containers/dealer-incentive-container/dealer-incentive-container.component';

@NgModule({
    declarations: [
        DealerIncentiveContainerComponent,
        IncentiveFilterBoxComponent,
        IncentiveInfoCardComponent,
        IncentiveInfoPieChartComponent,
        IncentiveTotalCardComponent,
        IncentiveAnnouncementCardComponent,
        IncentiveReportCardComponent,
        IncentivePayoutTrendComponent,
        MainCategoryCardComponent,
        PrepaidIncentiveReportComponent,
        // PayoutPageComponent,
        ViewPayoutComponent,
        IncentiveDisputeManagementComponent,
        IncentivePayoutHistoryComponent,
        IncentivePayoutTrendsListComponent
    ],
    imports: [
        CommonModule,
        NavigationModule,
        AppCommonModule,
        SWCommonModule,
        ChartsModule,
        FormsModule,
        StoreModule.forFeature('Incentive', incentiveReducer),
    ],
})
export class IncentiveModule {
}
