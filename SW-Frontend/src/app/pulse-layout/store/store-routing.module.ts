import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SBRouteData } from '../../../modules/navigation/models';
import { PermissionGuard } from '../../auth/guards/permission.guard';

import {
    DealerPaymentDueDetailsComponent,
} from './component/dealer-device-threshold/dealer-payment-due-details/dealer-payment-due-details.component';
import { BcCnuCpdManagementComponent } from './containers/bc-cnu-cpd-management/bc-cnu-cpd-management.component';
import { BcThresholdManagementComponent } from './containers/bc-threshold-management/bc-threshold-management.component';
import {
    DealerDeviceThresholdManagementComponent,
} from './containers/dealer-device-threshold-management/dealer-device-threshold-management.component';
import { EWalletComponent } from './containers/e-wallet/e-wallet.component';
import {
    ReceiptReprintManagementComponent,
} from './containers/receipt-reprint-management/receipt-reprint-management.component';
import { StoreManagementComponent } from './containers/store-management/store-management.component';
import { StoreModule } from './store.module';

export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: StoreManagementComponent,
        children: [
            {
                path: 'ewallet',
                canActivate: [PermissionGuard],
                data: {
                    title: 'eWallet',
                    breadcrumbs: [
                        {
                            text: 'eWallet',
                            active: true,
                        },
                    ],
                    role: 'EWALLET_OTHER',
                } as SBRouteData,
                component: EWalletComponent,
            },
            {
                path: 'device-threshold-dealer',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Device Threshold',
                    breadcrumbs: [
                        {
                            text: 'device threshold',
                            active: true,
                        },
                    ],
                    role: 'DEALER_DEVICE_THRESHOLD',
                } as SBRouteData,
                component: DealerDeviceThresholdManagementComponent,
            },
            {
                path: 'threshold-bc',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Threshold BC',
                    breadcrumbs: [
                        {
                            text: 'threshold bc',
                            active: true,
                        },
                    ],
                    role: 'BC_THRESHOLD_UPDATE',
                } as SBRouteData,
                component: BcThresholdManagementComponent,
            },
            {
                path: 'cnu-cpd-bc',
                canActivate: [PermissionGuard],
                data: {
                    title: 'CNU CPD BC',
                    breadcrumbs: [
                        {
                            text: 'cnu cpd bc',
                            active: true,
                        },
                    ],
                    role: 'CNU_CPD',
                } as SBRouteData,
                component: BcCnuCpdManagementComponent,
            },
            {
                path: 'receipt-reprint-bc',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Receipt Reprint',
                    breadcrumbs: [
                        {
                            text: 'Receipt Reprint - BC',
                            active: true,
                        },
                    ],
                    role: 'RECEIPT_REPRINT_BC',
                } as SBRouteData,
                component: ReceiptReprintManagementComponent,
            },
            {
                path: 'receipt-reprint-dealer',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Receipt Reprint',
                    breadcrumbs: [
                        {
                            text: 'Receipt Reprint - Dealer',
                            active: true,
                        },
                    ],
                    role: 'RECEIPT_REPRINT_DEALER',
                } as SBRouteData,
                component: ReceiptReprintManagementComponent,
            },
            {
                path: 'dealer-search-stock',
                // canActivate: [PermissionGuard],
                data: {
                    title: 'Dealer Search Stock',
                    breadcrumbs: [
                        {
                            text: 'Dealer Search Stock',
                            active: true,
                        },
                    ],
                    role: 'RECEIPT_REPRINT_BC',
                } as SBRouteData,
                component: DealerPaymentDueDetailsComponent,
            },
            {
                path: 'inventory',
                loadChildren: () =>
                    import('../inventory/inventory-routing.module').then(
                        (m) => m.InventoryRoutingModule,
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [StoreModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class StoreRoutingModule {
}
