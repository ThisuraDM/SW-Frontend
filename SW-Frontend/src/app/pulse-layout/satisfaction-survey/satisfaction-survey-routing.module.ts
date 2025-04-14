import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        // component: SatisfactionSurveyComponent,
        // children: [
        //     {
        //         path: 'ewallet',
        //         canActivate: [PermissionGuard],
        //         data: {
        //             title: 'eWallet',
        //             breadcrumbs: [
        //                 {
        //                     text: 'eWallet',
        //                     active: true,
        //                 },
        //             ],
        //         } as SBRouteData,
        //         component: EWalletComponent,
        //     }
        // ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class SatisfactionSurveyRoutingModule {
}
