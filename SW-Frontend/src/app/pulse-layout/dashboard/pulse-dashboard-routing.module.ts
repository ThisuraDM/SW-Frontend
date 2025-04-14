import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SBRouteData } from '../../../modules/navigation/models';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { RedirectGuard } from '../../auth/guards/redirect.guard';

import { BcKpiDashboardsComponent } from './containers/bc-kpi-dashboards/bc-kpi-dashboards.component';
import { DealerKpiDashboardComponent } from './containers/dealer-kpi-dashboard/dealer-kpi-dashboard.component';
import { SWDashboardModule } from './SW-dashboard.module';

export const ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                canActivate: [PermissionGuard, RedirectGuard],
                data: {
                    title: 'Dashboard - BC KPI',
                    breadcrumbs: [
                        {
                            text: 'Dashboard',
                            active: true,
                        },
                    ],
                    role: 'KPI_DASHBOARD_BC',
                } as SBRouteData,
                component: BcKpiDashboardsComponent,
            },
            {
                path: 'dealer-kpi-dashboard',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Dashboard - Dealer KPI',
                    breadcrumbs: [
                        {
                            text: 'Dashboard',
                            link: '/dashboard',
                        },
                        {
                            text: 'Multipurpose',
                            active: true,
                        },
                    ],
                    role: 'KPI_DASHBOARD_DEALER',
                } as SBRouteData,
                component: DealerKpiDashboardComponent,
            },
        ],
    },
];

@NgModule({
    imports: [SWDashboardModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class SWDashboardRoutingModule {}
