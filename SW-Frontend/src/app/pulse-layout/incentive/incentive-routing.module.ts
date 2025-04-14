import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SBRouteData } from '../../../modules/navigation/models';


import {
    IncentivePayoutHistoryComponent,
} from './components/incentive-payout-history/incentive-payout-history.component';
import {
    IncentivePayoutTrendsListComponent,
} from './components/incentive-payout-trends-list/incentive-payout-trends-list.component';
import { PrepaidIncentiveReportComponent } from './components/prepaid-incentive-report/prepaid-incentive-report.component';
import { ViewPayoutComponent } from './components/view-payout/view-payout.component';
import {
    DealerIncentiveContainerComponent,
} from './containers/dealer-incentive-container/dealer-incentive-container.component';
import { IncentiveModule } from './incentive.module';

export const ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                // canActivate: [PermissionGuard, RedirectGuard],
                data: {
                    title: 'Incentive - Dealer',
                    breadcrumbs: [
                        {
                            text: 'Incentive',
                            active: true,
                        },
                    ],
                    // role: 'DEALER_INCENTIVE',
                } as SBRouteData,
                component: DealerIncentiveContainerComponent,
            },
            {
                path: 'payout-trends',
                // canActivate: [PermissionGuard, RedirectGuard],
                data: {
                    title: 'Incentive Payout Trends - Dealer',
                    breadcrumbs: [
                        {
                            text: 'Incentive Payout Trends',
                            active: true,
                        },
                    ],
                    // role: 'DEALER_INCENTIVE',
                } as SBRouteData,
                component: IncentivePayoutTrendsListComponent,
            },{
                path: 'payout-history',
                // canActivate: [PermissionGuard, RedirectGuard],
                data: {
                    title: 'Incentive Payout History - Dealer',
                    breadcrumbs: [
                        {
                            text: 'Incentive Payout History',
                            active: true,
                        },
                    ],
                    // role: 'DEALER_INCENTIVE',
                } as SBRouteData,
                component: IncentivePayoutHistoryComponent,
            },{
                path: 'payout-page',
                // canActivate: [PermissionGuard, RedirectGuard],
                data: {
                    title: 'Incentive Payout Page - Dealer',
                    breadcrumbs: [
                        {
                            text: 'Incentive Payout Page',
                            active: true,
                        },
                    ],
                    // role: 'DEALER_INCENTIVE',
                } as SBRouteData,
                component: ViewPayoutComponent,
            },
            {
                path: 'incentive-report',
                // canActivate: [PermissionGuard, RedirectGuard],
                data: {
                    title: 'Incentive Report - Dealer',
                    breadcrumbs: [
                        {
                            text: 'Incentive Report',
                            active: true,
                        },
                    ],
                    // role: 'DEALER_INCENTIVE',
                } as SBRouteData,
                component: PrepaidIncentiveReportComponent,
            },
        ],
    },
];

@NgModule({
    imports: [IncentiveModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class IncentiveRoutingModule {
}
