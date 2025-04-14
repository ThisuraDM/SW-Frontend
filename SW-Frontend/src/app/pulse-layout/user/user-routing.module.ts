import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '@app/auth/guards/permission.guard';

import { SBRouteData } from '../../../modules/navigation/models';

import { ChangePasswordComponent } from './containers/change-password/change-password.component';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';
import { UserComponent } from './containers/user/user.component';
import { UserModule } from './user.module';

export const ROUTES: Routes = [
    {
        path: '',
        canActivate: [],
        component: UserComponent,
        children: [
            {
                path: 'change-password',
                data: {
                    title: 'Change Password',
                    breadcrumbs: [
                        {
                            text: 'Change Password',
                            active: true,
                        },
                    ],
                } as SBRouteData,
                component: ChangePasswordComponent,
            },
            {
                path: 'reset-password',
                canActivate: [PermissionGuard],
                data: {
                    title: 'Reset Password',
                    breadcrumbs: [
                        {
                            text: 'Reset Password',
                            active: true,
                        },
                    ],
                    role: 'ADMIN_PW_RESET',
                } as SBRouteData,
                component: ResetPasswordComponent,
            },
        ],
    },
];

@NgModule({
    imports: [UserModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
