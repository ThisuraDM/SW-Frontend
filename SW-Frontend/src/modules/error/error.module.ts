/* tslint:disable: ordered-imports*/
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import * as errorComponents from './components';

/* Containers */
import * as errorContainers from './containers';

/* Guards */
import * as errorGuards from './guards';

/* Services */
import * as errorServices from './services';
import { ErrorDuplicateTabsComponent } from './containers/error-duplicate-tabs/error-duplicate-tabs.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        AppCommonModule,
        NavigationModule,
    ],
    providers: [...errorServices.services, ...errorGuards.guards],
    declarations: [...errorContainers.containers, ...errorComponents.components, ErrorDuplicateTabsComponent,],
    exports: [...errorContainers.containers, ...errorComponents.components],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ErrorModule {}
