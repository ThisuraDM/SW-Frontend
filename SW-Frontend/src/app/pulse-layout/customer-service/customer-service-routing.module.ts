import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SBRouteData } from '../../../modules/navigation/models';
import { ReinstateRechargeCardSearchBoxComponent } from './components/reinstate-recharge-card-search-box/reinstate-recharge-card-search-box.component';
import { CustomerServiceManagementComponent } from './containers/customer-service-management/customer-service-management.component';
import { CustomerServiceModule } from './customer-service.module';
import { ReinstateRechargeCardDetailSummaryComponent } from './components/reinstare-recharge-card-detail-sumary/reinstate-recharge-card-detail-summary.component';
import { PermissionGuard } from '../../auth/guards/permission.guard';

export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: CustomerServiceManagementComponent,
        children: [
            {
                path: 'reinstate-recharge-card',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Reinstate Recharge Card',
                    breadcrumbs: [
                        {
                            text: 'Reinstate Recharge Card',
                            active: true,
                        },
                    ],
                    role: 'REINSTATE_RECHARGE_CARD_BC',
                } as SBRouteData,
                component: ReinstateRechargeCardSearchBoxComponent,
            }, {
                path: 'reinstate-recharge-card-detail-summary',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Reinstate Recharge Card',
                    breadcrumbs: [
                        {
                            text: 'Reinstate Recharge Card',
                            active: true,
                        },
                    ],
                    role: 'REINSTATE_RECHARGE_CARD_BC',
                } as SBRouteData,
                component: ReinstateRechargeCardDetailSummaryComponent,
            }
        ],
    },
];

@NgModule({
    imports: [CustomerServiceModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class CustomerServiceRoutingModule {
}
