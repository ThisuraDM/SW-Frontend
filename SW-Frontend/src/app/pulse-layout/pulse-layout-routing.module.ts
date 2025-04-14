import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/SW-dashboard-routing.module').then(
                (m) => m.SWDashboardRoutingModule,
            ),
    },
    {
        path: 'incentive',
        loadChildren: () =>
            import('./incentive/incentive-routing.module').then(
                (m) => m.IncentiveRoutingModule,
            ),
    },
    {
        path: 'store',
        loadChildren: () =>
            import('./store/store-routing.module').then(
                (m) => m.StoreRoutingModule,
            ),
    },
    {
        path: 'user',
        loadChildren: () =>
            import('./user/user-routing.module').then(
                (m) => m.UserRoutingModule,
            ),
    },
    {
        path: 'customer-service',
        loadChildren: () =>
            import('./customer-service/customer-service-routing.module').then(
                (m) => m.CustomerServiceRoutingModule,
            ),
    },
    {
        path: 'error',
        loadChildren: () =>
            import('../../modules/error/error-routing.module').then(
                (m) => m.ErrorRoutingModule,
            ),
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class SWLayoutRoutingModule {
}
