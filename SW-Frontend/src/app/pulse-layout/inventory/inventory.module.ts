import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { StyleReferenceModule } from '@modules/style-reference/style-reference.module';
import { TablesModule } from '@modules/tables/tables.module';
import { StoreModule } from '@ngrx/store';
import { TocModule } from 'modules/toc/toc.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { SWCommonModule } from '../../SW/SW-common/SW-common.module';
import { SatisfactionSurveyModule } from '../satisfaction-survey/satisfaction-survey.module';

import {inventoryReducer} from './../inventory/state/inventory-data-reducer';
import { BcStockReturnComponent } from './component/bc-stock-return/bc-stock-return.component';
import { PhysicalStockOrderingComponent } from './component/physical-stock-ordering/physical-stock-ordering.component';
import { InfoLegendCardComponent } from './component/physical-stock-ordering/promo/info-legend-card/info-legend-card.component';
import { RcspAddressComponent } from './component/physical-stock-ordering/rcsp-address/rcsp-address.component';
import { RcspDeliveryDetailsComponent } from './component/physical-stock-ordering/rcsp-delivery-details/rcsp-delivery-details.component';
import { RcspDetailSummaryComponent } from './component/physical-stock-ordering/rcsp-detail-summary/rcsp-detail-summary.component';
import { RcspSearchComponent } from './component/physical-stock-ordering/rcsp-search/rcsp-search.component';
import { RcspStockResultComponent } from './component/physical-stock-ordering/rcsp-stock-result/rcsp-stock-result.component';
import { BcStockRequestOtherStoreComponent } from './component/stock-request-components/bc-stock-request-other-store/bc-stock-request-other-store.component';
import { BcViewStockRequestSummaryComponent } from './component/stock-request-components/bc-view-stock-request-summary/bc-view-stock-request-summary.component';
import { BcViewSummaryOfStockReturnRequestToWarehouseComponent } from './component/stock-request-components/bc-view-summary-of-stock-return-request-to-warehouse/bc-view-summary-of-stock-return-request-to-warehouse.component';
import { DealerConfirmStockOrderDeliveryDetailsComponent } from './component/stock-request-components/dealer-confirm-stock-order-delivery-details/dealer-confirm-stock-order-delivery-details.component';
import { DealerStockRequestAddUpdateAddressPopupComponent } from './component/stock-request-components/dealer-stock-request-add-update-address-popup/dealer-stock-request-add-update-address-popup.component';
import { DealerViewStockOrderSummaryComponent } from './component/stock-request-components/dealer-view-stock-order-summary/dealer-view-stock-order-summary.component';
import { AcceptanceStockTransferSummaryComponent } from './component/track-stock-components/acceptance-stock-transfer-summary/acceptance-stock-transfer-summary.component';
import { AcknowledgeStockTransferSummaryComponent } from './component/track-stock-components/acknowledge-stock-transfer-summary/acknowledge-stock-transfer-summary.component';
import { AcknowledgeStockTransferComponent } from './component/track-stock-components/acknowledge-stock-transfer/acknowledge-stock-transfer.component';
import { BcSearchAndViewStockTransferRequestsBcBcComponent } from './component/track-stock-components/bc-search-and-view-stock-transfer-requests-bc-bc/bc-search-and-view-stock-transfer-requests-bc-bc.component';
import { BcSearchAndViewStockTransferRequestsWhBcComponent } from './component/track-stock-components/bc-search-and-view-stock-transfer-requests-wh-bc/bc-search-and-view-stock-transfer-requests-wh-bc.component';
import { BcTransferStockToDestinationBcAndViewSummaryComponent } from './component/track-stock-components/bc-transfer-stock-to-destination-bc-and-view-summary/bc-transfer-stock-to-destination-bc-and-view-summary.component';
import { BcTransferStockViewSummaryComponent } from './component/track-stock-components/bc-transfer-stock-view-summary/bc-transfer-stock-view-summary.component';
import { BcViewStockTransferDetailsBcToBcComponent } from './component/track-stock-components/bc-view-stock-transfer-details-bc-to-bc/bc-view-stock-transfer-details-bc-to-bc.component';
import { BcViewStockTransferDetailsWhToBcComponent } from './component/track-stock-components/bc-view-stock-transfer-details-wh-to-bc/bc-view-stock-transfer-details-wh-to-bc.component';
import { DealerRcspSearchTrackStockDetailsComponent } from './component/track-stock-components/dealer-rcsp-search-track-stock-details/dealer-rcsp-search-track-stock-details.component';
import { DealerRcspSearchTrackStockComponent } from './component/track-stock-components/dealer-rcsp-search-track-stock/dealer-rcsp-search-track-stock.component';
import { DealerSearchToTrackStockTransferComponent } from './component/track-stock-components/dealer-search-to-track-stock-transfer/dealer-search-to-track-stock-transfer.component';
import { DealerStockTransferDetailsTrackStockMovementComponent } from './component/track-stock-components/dealer-stock-transfer-details-track-stock-movement/dealer-stock-transfer-details-track-stock-movement.component';
import { DealerTrackStockTransferDetailsFromPlantComponent } from './component/track-stock-components/dealer-track-stock-transfer-details-from-plant/dealer-track-stock-transfer-details-from-plant.component';
import { HistoricalDataComponent } from './component/track-stock-components/historical-data/historical-data.component';
import { StockTransferRequestAcceptanceComponent } from './component/track-stock-components/stock-transfer-request-acceptance/stock-transfer-request-acceptance.component';
import { TrackStockHorizontalHeadingBarComponent } from './component/track-stock-components/track-stock-horizontal-heading-bar/track-stock-horizontal-heading-bar.component';
import { UnmatchedItemComponent } from './component/track-stock-components/unmatched-item/unmatched-item.component';
import { BcSearchStockComponent } from './component/view-stock-components/bc-search-stock/bc-search-stock.component';
import { BcViewStockLevelDetailsComponent } from './component/view-stock-components/bc-view-stock-level-details/bc-view-stock-level-details.component';
import { DealerSearchStockComponent } from './component/view-stock-components/dealer-search-stock/dealer-search-stock.component';
import { BcStockRequestManagementComponent } from './containers/bc-stock-request-management/bc-stock-request-management.component';
import { BcTrackStockTransferManagement } from './containers/bc-track-stock-transfer-management/bc-track-stock-transfer-management.component';
import { BcViewStockManagementComponent } from './containers/bc-view-stock-management/bc-view-stock-management.component';
import { DealerTrackStockTransferManagementComponent } from './containers/dealer-track-stock-transfer-management/dealer-track-stock-transfer-management.component';
import { DealerViewStockManagementComponent } from './containers/dealer-view-stock-management/dealer-view-stock-management.component';
import { InventoryManagementComponent } from './containers/inventory-management/inventory-management.component';
import { PhysicalStockOrderingManagementComponent } from './containers/physical-stock-ordering-management/physical-stock-ordering-management.component';
import { BcAcknowledgeStockTransferByItemComponent } from './component/track-stock-components/bc-acknowledge-stock-transfer-by-item/bc-acknowledge-stock-transfer-by-item.component';
import { DealerStockAcknowledgeManagementComponent } from './containers/dealer-stock-acknowledge-management/dealer-stock-acknowledge-management.component';
import { CcpDealerStockAcknowledgeRequestsComponent } from './component/ccp-dealer-acknowledge/ccp-dealer-stock-acknowledge-requests/ccp-dealer-stock-acknowledge-requests.component';
import { CcpDealerStockAcknowledgeItemsComponent } from './component/ccp-dealer-acknowledge/ccp-dealer-stock-acknowledge-items/ccp-dealer-stock-acknowledge-items.component';
import { CcpDealerStockAcknowledgeSerialsComponent } from './component/ccp-dealer-acknowledge/ccp-dealer-stock-acknowledge-serials/ccp-dealer-stock-acknowledge-serials.component';
import { CcpDealerStockAcknowledgeSummaryComponent } from './component/ccp-dealer-acknowledge/ccp-dealer-stock-acknowledge-summary/ccp-dealer-stock-acknowledge-summary.component';

@NgModule({
    declarations: [
        InventoryManagementComponent,
        BcSearchStockComponent,
        DealerSearchStockComponent,
        DealerSearchStockComponent,
        BcViewStockLevelDetailsComponent,
        BcStockReturnComponent,
        BcStockRequestOtherStoreComponent,
        BcViewStockTransferDetailsBcToBcComponent,
        BcViewStockTransferDetailsWhToBcComponent,
        BcTransferStockToDestinationBcAndViewSummaryComponent,
        BcTrackStockTransferManagement,
        BcViewStockManagementComponent,
        DealerViewStockManagementComponent,
        BcStockRequestManagementComponent,
        BcSearchAndViewStockTransferRequestsBcBcComponent,
        StockTransferRequestAcceptanceComponent,
        AcceptanceStockTransferSummaryComponent,
        AcknowledgeStockTransferComponent,
        HistoricalDataComponent,
        TrackStockHorizontalHeadingBarComponent,
        BcTransferStockViewSummaryComponent,
        BcViewStockRequestSummaryComponent,
        DealerViewStockOrderSummaryComponent,
        BcViewSummaryOfStockReturnRequestToWarehouseComponent,
        AcknowledgeStockTransferSummaryComponent,
        UnmatchedItemComponent,
        BcSearchAndViewStockTransferRequestsWhBcComponent,
        DealerTrackStockTransferDetailsFromPlantComponent,
        DealerStockTransferDetailsTrackStockMovementComponent,
        DealerTrackStockTransferManagementComponent,
        DealerSearchToTrackStockTransferComponent,
        DealerConfirmStockOrderDeliveryDetailsComponent,
        DealerStockRequestAddUpdateAddressPopupComponent,
        PhysicalStockOrderingComponent,
        PhysicalStockOrderingManagementComponent,
        RcspSearchComponent,
        RcspStockResultComponent,
        InfoLegendCardComponent,
        RcspAddressComponent,
        RcspDeliveryDetailsComponent,
        RcspDetailSummaryComponent,
      DealerRcspSearchTrackStockComponent,
    DealerRcspSearchTrackStockDetailsComponent,
    BcAcknowledgeStockTransferByItemComponent,
    DealerStockAcknowledgeManagementComponent,
    CcpDealerStockAcknowledgeRequestsComponent,
    CcpDealerStockAcknowledgeItemsComponent,
    CcpDealerStockAcknowledgeSerialsComponent,
    CcpDealerStockAcknowledgeSummaryComponent,
  ],
    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        AppCommonModule,
        StyleReferenceModule,
        FormsModule,
        TablesModule,
        ReactiveFormsModule,
        SWCommonModule,
        NgMultiSelectDropDownModule,
        CurrencyMaskModule,
        TocModule,
        SatisfactionSurveyModule,
        StoreModule.forFeature('Inventory', inventoryReducer),
    ],
})
export class InventoryModule {
}
