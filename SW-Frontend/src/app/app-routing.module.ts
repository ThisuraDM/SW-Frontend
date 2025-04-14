import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SWLayoutComponent } from '@app/SW-layout/SW-layout.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/auth-landing',
    },
    {
        path: '',
        component: SWLayoutComponent,
        loadChildren: () =>
            import('@app/SW-layout/SW-layout-routing.module').then(
                (m) => m.SWLayoutRoutingModule
            ),
    },
    {
        path: '',
        loadChildren: () =>
            import('@app/auth/auth-routing.module').then(
                (m) => m.AuthRoutingModule
            ),
    },
    {
        path: '',
        loadChildren: () =>
            import('@modules/error/error-routing.module').then(
                (m) => m.ErrorRoutingModule
            ),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            relativeLinkResolution: 'legacy',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
