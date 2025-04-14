/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SBRouteData } from '@modules/navigation/models';

/* Module */
import { ErrorModule } from './error.module';

/* Containers */
import * as errorContainers from './containers';

/* Guards */

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '404-2',
    },
    {
        path: '400',
        canActivate: [],
        component: errorContainers.Error400Component,
        data: {
            title: 'Error 400 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '401',
        canActivate: [],
        component: errorContainers.Error401Component,
        data: {
            title: 'Error 401 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '403',
        canActivate: [],
        component: errorContainers.Error403Component,
        data: {
            title: 'Error 403 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '404-1',
        canActivate: [],
        component: errorContainers.Error4041Component,
        data: {
            title: 'Error 404 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '404-2',
        canActivate: [],
        component: errorContainers.Error4042Component,
        data: {
            title: 'Error 404 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '500',
        canActivate: [],
        component: errorContainers.Error500Component,
        data: {
            title: 'Error 500 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '503',
        canActivate: [],
        component: errorContainers.Error503Component,
        data: {
            title: 'Error 503 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '503-sudden-maintenance',
        canActivate: [],
        component: errorContainers.Error503SuddenMaintenanceComponent,
        data: {
            title: 'Error 503 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '503-planned-maintenance',
        canActivate: [],
        component: errorContainers.Error503PlannedMaintenanceComponent,
        data: {
            title: 'Error 503 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '504',
        canActivate: [],
        component: errorContainers.Error504Component,
        data: {
            title: 'Error 504 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '403-duplicate-tab',
        canActivate: [],
        component: errorContainers.ErrorDuplicateTabsComponent,
        data: {
            title: 'Error 504 - SW Backoffice',
        } as SBRouteData,
    },
    {
        path: '**',
        pathMatch: 'full',
        canActivate: [],
        component: errorContainers.Error4042Component,
        data: {
            title: 'Error 404 - SW Backoffice',
        } as SBRouteData,
    },
];

@NgModule({
    imports: [ErrorModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ErrorRoutingModule {}
