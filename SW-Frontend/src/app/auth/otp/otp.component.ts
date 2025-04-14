import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@app/auth/services/auth.service';
import { ValidateOTPRequest, ValidateOTPResponse } from '@app/auth/models/auth';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
    selector: 'SW-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {

    sessionId!: string | null;
    validateOTPRequest!: ValidateOTPRequest;
    validateOTPResponse!: ValidateOTPResponse;
    otp: string ='';
    invalidOtp: boolean = true;
    otpRequired: boolean = true;
    timeLeft: number = 0;
    interval: any;
    minutes: number = 0;
    seconds: number = 0;

    constructor(private modalService: NgbModal,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private localStorageService: LocalStorageService,
    ) {
    }

    ngOnInit(): void {
        this.sessionId = this.route.snapshot.paramMap.get('login_session_id');
        this.startTimer();
    }

    onSubmit() {
        if (this.otp != null) {
            if (this.sessionId) {
                this.validateOTPRequest = {
                    otp_value: this.otp,
                };
                this.authService.validateOTP(this.validateOTPRequest, this.sessionId)
                    .subscribe(res => {
                        this.invalidOtp = true;
                        this.validateOTPResponse = res;
                        this.localStorageService.setToken(this.validateOTPResponse.id_token);
                        this.router.navigate(['/dashboard']);
                    }, error => {
                        this.invalidOtp = false;
                    });
            }
        } else {
            this.otpRequired = false;
        }
    }

    resendCode() {
        if (this.sessionId) {
            this.authService.sendOTP(this.sessionId)
                .subscribe(res => {
                    this.startTimer();
                });
        }
    }

    startTimer() {
        clearInterval(this.interval);
        this.timeLeft = 180;
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.minutes = Math.floor(this.timeLeft % 3600 / 60);
                this.seconds = Math.floor(this.timeLeft % 60);
            }
        }, 1000);
    }
}
