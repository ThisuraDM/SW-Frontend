import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
    selector: 'SW-send-otp',
    templateUrl: './send-otp.component.html',
    styleUrls: ['./send-otp.component.scss'],
})
export class SendOtpComponent implements OnInit {

    sessionId!: string | null;
    mobileNumberMask!: string | null;
    errorMessage!: string | null;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService) {
        this.sessionId = this.route.snapshot.paramMap.get('login_session_id');
        this.mobileNumberMask = this.route.snapshot.paramMap.get('mobile_number');
    }

    ngOnInit(): void {

    }

    sendCode() {
        if (this.sessionId) {
            this.authService.sendOTP(this.sessionId)
                .subscribe(res => {
                    if (res.login_session_id && res.mobile_number) {
                        this.router.navigate([`/auth-otp/${res.login_session_id}/${res.mobile_number}`]);
                    }
                },error => {
                    this.errorMessage = error.error.errorMessage;
                });
        }
    }
}
