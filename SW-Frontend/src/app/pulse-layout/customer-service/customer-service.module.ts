import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerServiceManagementComponent } from './containers/customer-service-management/customer-service-management.component';
import { ReinstateRechargeCardSearchBoxComponent } from './components/reinstate-recharge-card-search-box/reinstate-recharge-card-search-box.component';
import { RouterModule } from '@angular/router';
import { AppCommonModule } from '../../../modules/app-common/app-common.module';
import { NavigationModule } from '../../../modules/navigation/navigation.module';
import { SWCommonModule } from '../../SW/SW-common/SW-common.module';
import { ReinstateRechargeCardDetailSummaryComponent } from './components/reinstare-recharge-card-detail-sumary/reinstate-recharge-card-detail-summary.component';

@NgModule({
    declarations: [
        CustomerServiceManagementComponent,
        ReinstateRechargeCardSearchBoxComponent,
        ReinstateRechargeCardDetailSummaryComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NavigationModule,
        AppCommonModule,
        ReactiveFormsModule,
        SWCommonModule,
    ],
    exports: [],
})
export class CustomerServiceModule {
}

