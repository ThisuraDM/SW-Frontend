import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { NgxCaptchaModule } from 'ngx-captcha';

import { AuthRoutingModule } from './auth-routing.module';
import { LandingComponent } from './landing/landing.component';
import { LoginCommonComponent } from './login-common/login-common.component';
import { OtpComponent } from './otp/otp.component';
import { SendOtpComponent } from './send-otp/send-otp.component';
import { NgxNumbersOnlyDirectiveModule } from 'ngx-numbers-only-directive';
import { FeatherModule } from 'angular-feather';
import { ErrorModule } from '@modules/error/error.module';

@NgModule({
  declarations: [
    OtpComponent,
    LandingComponent,
    LoginCommonComponent,
    SendOtpComponent
  ],
    imports: [
        FormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        NgxCaptchaModule,
        CommonModule,
        AuthRoutingModule,
        NavigationModule,
        NgxNumbersOnlyDirectiveModule,
        FeatherModule,
        ErrorModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AuthModule { }
