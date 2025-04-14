/* tslint:disable: ordered-imports*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Modules */
import { AppCommonModule } from '@common/app-common.module';

/* Components */
import * as navigationComponents from './components';

/* Containers */
import * as navigationContainers from './containers';

/* Layouts */
import * as appCommonLayouts from './layouts';

/* Guards */
import * as navigationGuards from './guards';

/* Services */
import * as navigationServices from './services';
import { AlertsService } from '@modules/alerts/services';
import { MessagesService } from '@modules/messages/services';
import { SatisfactionSurveyModule } from '@app/SW-layout/satisfaction-survey/satisfaction-survey.module';
import { SWCommonModule } from '@app/SW/SW-common/SW-common.module';
import { IconComponent } from '@app/SW/SW-common/components/icon/icon.component';

@NgModule({
    imports: [CommonModule, RouterModule, AppCommonModule, SatisfactionSurveyModule, SWCommonModule],
    declarations: [
        ...navigationContainers.containers,
        ...navigationComponents.components,
        ...appCommonLayouts.layouts,
        IconComponent,
    ],
    exports: [
        ...navigationContainers.containers,
        ...navigationComponents.components,
        ...appCommonLayouts.layouts,
    ],
    providers: [{ provide: 'window', useValue: window }],
})
export class NavigationModule {
    static forRoot(): ModuleWithProviders<NavigationModule> {
        return {
            ngModule: NavigationModule,
            providers: [
                ...navigationServices.services,
                ...navigationGuards.guards,
                AlertsService,
                MessagesService,
            ],
        };
    }
}
