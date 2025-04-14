import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SBRouteData } from '../../../modules/navigation/models';
import { PermissionGuard } from '../../auth/guards/permission.guard';

import { BcStockReturnComponent } from './component/bc-stock-return/bc-stock-return.component';
import { PhysicalStockOrderingComponent } from './component/physical-stock-ordering/physical-stock-ordering.component';
import { BcViewStockRequestSummaryComponent } from './component/stock-request-components/bc-view-stock-request-summary/bc-view-stock-request-summary.component';
import { AcknowledgeStockTransferComponent } from './component/track-stock-components/acknowledge-stock-transfer/acknowledge-stock-transfer.component';
import { BcViewStockTransferDetailsBcToBcComponent } from './component/track-stock-components/bc-view-stock-transfer-details-bc-to-bc/bc-view-stock-transfer-details-bc-to-bc.component';
import { BcStockRequestManagementComponent } from './containers/bc-stock-request-management/bc-stock-request-management.component';
import { BcTrackStockTransferManagement } from './containers/bc-track-stock-transfer-management/bc-track-stock-transfer-management.component';
import { BcViewStockManagementComponent } from './containers/bc-view-stock-management/bc-view-stock-management.component';
import { DealerStockAcknowledgeManagementComponent } from './containers/dealer-stock-acknowledge-management/dealer-stock-acknowledge-management.component';
import { DealerTrackStockTransferManagementComponent } from './containers/dealer-track-stock-transfer-management/dealer-track-stock-transfer-management.component';
import { DealerViewStockManagementComponent } from './containers/dealer-view-stock-management/dealer-view-stock-management.component';
import { InventoryManagementComponent } from './containers/inventory-management/inventory-management.component';
import { PhysicalStockOrderingManagementComponent } from './containers/physical-stock-ordering-management/physical-stock-ordering-management.component';
import { InventoryModule } from './inventory.module';

export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: InventoryManagementComponent,
        children: [
            {
                path: 'bc-search-stock',
                canActivate: [PermissionGuard],
                data: {
                    title: 'bc-search-stock',
                    breadcrumbs: [
                        {
                            text: 'bc-search-stock',
                            active: true,
                        },
                    ],
                    role: 'VIEW_STOCK_BC',
                } as SBRouteData,
                component: BcViewStockManagementComponent,
            },
            {
                path: 'dealer-search-stock',
                canActivate: [PermissionGuard],
                data: {
                    title: 'dealer-search-stock',
                    breadcrumbs: [
                        {
                            text: 'dealer-search-stock',
                            active: true,
                        },
                    ],
                    role: 'VIEW_STOCK_DEALER',
                } as SBRouteData,
                component: DealerViewStockManagementComponent,
            },
            {
                path: 'bc-stock-return',
                canActivate: [PermissionGuard],
                data: {
                    title: 'bc-stock-return',
                    breadcrumbs: [
                        {
                            text: 'bc-stock-return',
                            active: true,
                        },
                    ],
                    role: 'STOCK_RETURN_BC',
                } as SBRouteData,
                component: BcStockReturnComponent,
            },
            {
                path: 'bc-stock-request-other-store',
                canActivate: [PermissionGuard],
                data: {
                    title: 'bc-stock-request-other-store',
                    breadcrumbs: [
                        {
                            text: 'bc-stock-request-other-store',
                            active: true,
                        },
                    ],
                    role: 'STOCK_TRANSFER_BC',
                } as SBRouteData,
                component: BcStockRequestManagementComponent,
            },
            {
                path: 'bc-view-stock-request-summary',
                canActivate: [PermissionGuard],
                data: {
                    title: 'bc-view-stock-request-summary',
                    breadcrumbs: [
                        {
                            text: 'bc-view-stock-request-summary',
                            active: true,
                        },
                    ],
                    role: 'STOCK_TRANSFER_BC',
                } as SBRouteData,
                component: BcViewStockRequestSummaryComponent,
            },
            {
                path: 'bc-track-stock-transfer-bc-to-bc',
                canActivate: [PermissionGuard],
                data: {
                    title: 'BC Track Stock Transfer BC to BC',
                    breadcrumbs: [
                        {
                            text: 'BC Track Stock Transfer BC to BC',
                            active: true,
                        },
                    ],
                    role: 'TRACK_STOCK_TRANSFER_BC',
                } as SBRouteData,
                component: BcTrackStockTransferManagement,
            },
            {
                path: 'bc-track-stock-transfer-bc-to-bc/:requestId/:requestStatus/:transferFromStoreId/:transferToStoreId',
                canActivate: [PermissionGuard],
                data: {
                    title: 'BC Track Stock Transfer BC to BC',
                    breadcrumbs: [
                        {
                            text: 'BC Track Stock Transfer BC to BC',
                            active: true,
                        },
                    ],
                    role: 'TRACK_STOCK_TRANSFER_BC',
                } as SBRouteData,
                component: BcTrackStockTransferManagement,
            },
            {
                path: 'requestor',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Dealer Track Stock Transfer BC to BC',
                    breadcrumbs: [
                        {
                            text: 'Dealer Track Stock Transfer BC to BC',
                            active: true,
                        },
                    ],
                    role: 'TRACK_STOCK_TRANSFER_BC',
                } as SBRouteData,
                component: BcViewStockTransferDetailsBcToBcComponent
            },
            {
                path: 'dealer-track-stock-transfer',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Dealer Track Stock Transfer BC to BC',
                    breadcrumbs: [
                        {
                            text: 'Dealer Track Stock Transfer BC to BC',
                            active: true,
                        },
                    ],
                    role: 'TRACK_STOCK_TRANSFER_DEALER',
                } as SBRouteData,
                component: DealerTrackStockTransferManagementComponent
            },
            {
                path: 'dealer-stock-acknowledgement',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Dealer Stock Acknowledgement',
                    breadcrumbs: [
                        {
                            text: 'Dealer Stock Acknowledgement',
                            active: true,
                        },
                    ],
                    role: 'STOCK_ACKNOWLEDGEMENT_DEALER',
                } as SBRouteData,
                component: DealerStockAcknowledgeManagementComponent
            },

            {
                path: 'dealer-track-stock-transfer/:requestId/:requestStatus',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Dealer Track Stock Transfer BC to BC',
                    breadcrumbs: [
                        {
                            text: 'Dealer Track Stock Transfer BC to BC',
                            active: true,
                        },
                    ],
                    role: 'TRACK_STOCK_TRANSFER_DEALER',
                } as SBRouteData,
                component: DealerTrackStockTransferManagementComponent
            },
            {
                path: 'summary',
                canActivate: [PermissionGuard],
                data: {
                    title: 'bc-view-stock-request-summary',
                    breadcrumbs: [
                        {
                            text: 'bc-view-stock-request-summary',
                            active: true,
                        },
                    ],
                    role: 'STOCK_TRANSFER_BC',
                } as SBRouteData,
                component: AcknowledgeStockTransferComponent,
            },
            {
                path: 'dealer-physical-stock-ordering',
                canActivate: [PermissionGuard],
                data: {
                    title: 'dealer-physical-stock-ordering',
                    breadcrumbs: [
                        {
                            text: 'dealer-physical-stock-ordering',
                            active: true,
                        },
                    ],
                    role: 'PHYSICAL_STOCK_ORDERING_DEALER',
                } as SBRouteData,
                component: PhysicalStockOrderingManagementComponent,
            },
        ],
    },
];

@NgModule({
    imports: [InventoryModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class InventoryRoutingModule {
}
