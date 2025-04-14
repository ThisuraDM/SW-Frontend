import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendOtpComponent } from '@app/auth/send-otp/send-otp.component';
import { SBRouteData } from '@modules/navigation/models';

import { LandingComponent } from './landing/landing.component';
// import { LoginCommonComponent } from './login-common/login-common.component';
import { OtpComponent } from './otp/otp.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/auth-landing',
    },
    {
        path: 'send-otp/:login_session_id/:mobile_number',
        canActivate: [],
        data: {
            title: 'SW Backoffice',
        } as SBRouteData,
        component: SendOtpComponent,
    },
    {
        path: 'auth-otp/:login_session_id/:mobile_number',
        canActivate: [],
        data: {
            title: 'SW Backoffice',
        } as SBRouteData,
        component: OtpComponent,
    },
    {
        path: 'auth-landing',
        canActivate: [],
        data: {
            title: 'SW Backoffice',
        } as SBRouteData,
        component: LandingComponent,
    },
    // {
    //     path: 'auth-common/:auth_type',
    //     pathMatch: 'full',
    //     canActivate: [],
    //     data: {
    //         title: 'SW Backoffice',
    //     } as SBRouteData,
    //     component: LoginCommonComponent,
    // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
