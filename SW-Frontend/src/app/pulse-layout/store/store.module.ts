import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { AppCommonModule } from '../../../modules/app-common/app-common.module';
import { NavigationModule } from '../../../modules/navigation/navigation.module';
import { StyleReferenceModule } from '../../../modules/style-reference/style-reference.module';
import { TablesModule } from '../../../modules/tables/tables.module';
import { SWCommonModule } from '../../SW/SW-common/SW-common.module';
import { SWDashboardModule } from '../dashboard/SW-dashboard.module';

import { CnuComponent } from './component/bc-cnu-cpd-management/cnu/cnu.component';
import { CpdComponent } from './component/bc-cnu-cpd-management/cpd/cpd.component';
import { CnuUpdateComponent } from './component/bc-cnu-cpd-management/generate-report-and-bis/cnu-update/cnu-update.component';
import { GenerateReportAndBISComponent } from './component/bc-cnu-cpd-management/generate-report-and-bis/generate-report-and-bis.component';
import { NgbDateCustomParserFormatter } from './component/bc-cnu-cpd-management/ngb-custom-parser-formatter';
import { EWalletBalanceStatusComponent } from './component/e-wallet-balance-status/e-wallet-balance-status.component';
import { EWalletTopupBoxComponent } from './component/e-wallet-topup-box/e-wallet-topup-box.component';
import { EWalletTransactionHistoryComponent } from './component/e-wallet-transaction-history/e-wallet-transaction-history.component';
import { StoreInformationBoxComponent } from './component/store-information-box/store-information-box.component';
import { ThresholdCollectionListComponent } from './component/threshold-collection-list/threshold-collection-list.component';
import { ThresholdInformationComponent } from './component/threshold-information/threshold-information.component';
import { ThresholdRequestComponent } from './component/threshold-request/threshold-request.component';
import { BcCnuCpdManagementComponent } from './containers/bc-cnu-cpd-management/bc-cnu-cpd-management.component';
import { BcThresholdManagementComponent } from './containers/bc-threshold-management/bc-threshold-management.component';
import { DealerThresholdManagementComponent } from './containers/dealer-threshold-management/dealer-threshold-management.component';
import { EWalletComponent } from './containers/e-wallet/e-wallet.component';
import { StoreManagementComponent } from './containers/store-management/store-management.component';
import { ReceiptReprintManagementComponent } from './containers/receipt-reprint-management/receipt-reprint-management.component';
import { DealerSearchAndViewTransactionDetailsComponent } from './component/dealer-device-threshold/dealer-search-and-view-transaction-details/dealer-search-and-view-transaction-details.component';
import { DealerPaymentDueDetailsComponent } from './component/dealer-device-threshold/dealer-payment-due-details/dealer-payment-due-details.component';
import { DealerDeviceThresholdManagementComponent } from './containers/dealer-device-threshold-management/dealer-device-threshold-management.component';
import { DealerExcessThresholdWithdrawalComponent } from './component/dealer-device-threshold/dealer-excess-threshold-withdrawal/dealer-excess-threshold-withdrawal.component';
import { NgxMaskModule } from 'ngx-mask';
import { EWalletCashoutSummaryComponent } from './component/e-wallet-cashout-summary/e-wallet-cashout-summary.component';
import { SatisfactionSurveyModule } from '../satisfaction-survey/satisfaction-survey.module';

@NgModule({
    declarations: [
        EWalletComponent,
        StoreManagementComponent,
        BcThresholdManagementComponent,
        DealerThresholdManagementComponent,
        StoreInformationBoxComponent,
        ThresholdInformationComponent,
        EWalletTopupBoxComponent,
        EWalletBalanceStatusComponent,
        ThresholdRequestComponent,
        ThresholdCollectionListComponent,
        EWalletTransactionHistoryComponent,
        BcCnuCpdManagementComponent,
        CnuComponent,
        GenerateReportAndBISComponent,
        CnuUpdateComponent,
        CpdComponent,
        ReceiptReprintManagementComponent,
        DealerSearchAndViewTransactionDetailsComponent,
        DealerPaymentDueDetailsComponent,
        DealerDeviceThresholdManagementComponent,
        DealerExcessThresholdWithdrawalComponent,
        EWalletCashoutSummaryComponent
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
        SWDashboardModule,
        SWCommonModule,
        NgMultiSelectDropDownModule,
        CurrencyMaskModule,
        NgxMaskModule,
        SatisfactionSurveyModule,
    ],
    providers: [CurrencyPipe, DatePipe,{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],
})
export class StoreModule {}
