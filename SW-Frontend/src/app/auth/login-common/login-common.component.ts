import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { URLConfigState } from 'state/url-configs-reducer';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'SW-login-common',
  templateUrl: './login-common.component.html',
  styleUrls: ['./login-common.component.scss']
})
export class LoginCommonComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
    recaptchaEle: ['', Validators.required]
  });
  siteKey = `${environment.recaptchaSiteKey}`;
  recaptcha = '';
  commonLoginValidation: string | undefined = undefined;
  authType!: string | null;
  disableRedirect = true;
  constructor(
    private msalService: MsalService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<{ params: URLConfigState }>
  ) { }


  ngOnInit(): void {
    this.authType = this.route.snapshot.paramMap.get('auth_type');
    if (!(this.authType === 'bc' || this.authType === 'dealer')) {
      this.router.navigate(['/auth-landing']);
    }
    this.store.select('params').subscribe((data) => {
      const disableRe = data.urlConfigs.disable_redirect;
      this.disableRedirect = disableRe
  });
  }

  loginWithAd = () => {
    const loginRequest = {
      scopes: ['user.read', 'mail.send'], // optional Array<string>
    };

    // Check if user signed in
    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      // redirect anonymous user to login page
      this.msalService.instance.loginRedirect(loginRequest);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loginWithB2C = () => {
    const msUrl = `${environment.b2cRedirect}`;
    window.open(msUrl, '_self');
  }

  loginWithCustomLogin = () => {
    // call the auth service. on Success do what happens in the redirect guard and navigate to dashboard.

    this.authService.loginWithBC({ ...this.loginForm.value, user_type: this.authType === 'bc' ? 'internal' : 'external' })
      .toPromise().then(res => {
        this.router.navigate([`/send-otp/${res.login_session_id}/${res.mobile_number}`]);
        // on success save or pass the mobile number and the login session id to otp screen
      }).catch(err => {
        this.commonLoginValidation = err.error.errorMessage
        // show the error message
      })
  }

  clearCommonValidators = () => {
    this.commonLoginValidation = undefined
  }
}
