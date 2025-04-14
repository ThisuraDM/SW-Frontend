import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppCommonModule } from '../../../modules/app-common/app-common.module';
import { NavigationModule } from '../../../modules/navigation/navigation.module';
import { StyleReferenceModule } from '../../../modules/style-reference/style-reference.module';
import { TablesModule } from '../../../modules/tables/tables.module';

import { ChangePasswordComponent } from './containers/change-password/change-password.component';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';
import { UserComponent } from './containers/user/user.component';
import { StatusVerificationAlertsComponent } from './utility/status-verification-alerts/status-verification-alerts.component';

@NgModule({
    declarations: [
        ChangePasswordComponent,
        UserComponent,
        ResetPasswordComponent,
        StatusVerificationAlertsComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        NavigationModule,
        AppCommonModule,
        StyleReferenceModule,
        FormsModule,
        TablesModule,
    ],
})
export class UserModule {
}
