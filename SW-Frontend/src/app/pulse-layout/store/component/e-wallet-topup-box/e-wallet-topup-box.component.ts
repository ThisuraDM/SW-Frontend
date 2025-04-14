import { Location } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OTPRequestEwallet, OTPResponseEwallet, ValidateOTPRequest, ValidateOTPRequestEwallet, ValidateOTPResponse, ValidateOTPResponseEwallet } from '@app/auth/models/auth';
import { AuthService } from '@app/auth/services/auth.service';
import {
    BalanceStatus,
    CashoutRequest,
    CashoutRequestDto,
    PaymentResponse,
    TopUpFormData,
    TransferRequestResponse,
} from '@app/SW-layout/store/models/ewallet';
import { EwalletService } from '@app/SW-layout/store/services/ewallet.service';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Rewind } from 'angular-feather/icons';
import * as CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';
import { Outlets } from 'models/login-details';
import { v4 as uuidv4 } from 'uuid';

import { StorageSettings } from '../../../../../constants/StorageSettings';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { EWalletCashoutTransactionItem } from '../../models/e-wallet-transaction-history-data';
import { DealerThresholds } from '../../models/threshold/dealer-thresholds';
import { ThresholdService } from '../../services/threshold/threshold.service';

/**
 * SW e wallet topup box component
 * Author: Milan Perera
 * Created Date: 2021 October 10
 */
@Component({
    selector: 'SW-e-wallet-topup-box',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './e-wallet-topup-box.component.html',
    styleUrls: ['e-wallet-topup-box.component.scss'],
})
export class EWalletTopupBoxComponent implements OnInit, OnChanges {
    @ViewChild('paymentFormGroup') paymentFormElement!: ElementRef<HTMLFormElement>;
    @ViewChild('modalSuccessful', { static: true })
    modalSuccessful!: TemplateRef<any>;

    @ViewChild('modalUnsuccessful', { static: true })
    modalUnsuccessful!: TemplateRef<any>;

    @ViewChild('modalConfirmTopUp', { static: true })
    modalConfirmTopUp!: TemplateRef<any>;

    @ViewChild('modalInactiveOutlet', { static: true })
    modalInactiveOutlet!: TemplateRef<any>;

    @ViewChild('modalOTP', { static: true })
    modalOTP!: TemplateRef<any>;

    @ViewChild('modalCashOutErrorMessages', { static: true })
    modalCashOutErrorMessages!: TemplateRef<any>;

    @Output() showSummary = new EventEmitter<boolean>();
    @Output() setTransactionItem = new EventEmitter<EWalletCashoutTransactionItem>();

    public ewalletUrl: string = environment.ewallet
    timeLeft = 0;
    interval: any;
    public minutes = 0;
    public seconds = 0;

    transferRequestResponse: TransferRequestResponse = {
        orderId: '',
        paymentMethod: '',
        prePayment: '',
        reconFileName: '',
        responseUrl: '',
        signature: '',
        signature2: '',
        storeId: '',
        totalAmount: '',
        transDate: '',
    };

    topUpFormData: TopUpFormData = {
        amount: 0,
        outlet_id: '',
        payment_method: 7,
    };

    paymentResponse: PaymentResponse = {
        paymentMethod: '',
        outletId: '',
        amount: '',
        orderId: '',
        reasonCode: '',
        reasonCodeType: '',
        signature2: '',
    };

    balanceStatus: BalanceStatus = {
        account_status: '',
        account_name: '',
        account_no: '',
        available_balance: '',
        account_holder_public_name: '',
    };

    selectedOutletName = '';
    selectedPaymentVia = 1;
    outletList: any[] = [];
    isDealerOwner = true;
    public disableConfirm = true;
    htmlText = '';
    convertedAmount: string | null | undefined;
    cashOutAmount = 0;
    pinNumber = '';
    cashoutErrorMessage = ''
    otpErrorMessage = '';
    dealerRetrieve: DealerThresholds = {
        device_credit_limit: '',
        available_credit_limit: '',
        utilization: '',
        threshold_limit: '',
        cash_out_eligibility: false,
        partner_sap_id: '',
        user_first_name: '',
        cel_minimum_ewallet_balance: '',
        outlet_id: '',
        cel_owner_phone: '',
        cell_phone: ''
    }
    referenceNumber = '';
    otp = '';
    otp1 = '';
    otp2 = '';
    otp3 = '';
    otp4 = '';
    otp5 = '';
    otp6 = '';

    validateOTPRequest: ValidateOTPRequestEwallet = {
        otp: '',
        security_code: '',
        session_id: ''
    };
    validateOTPResponse: ValidateOTPResponseEwallet = {

    };
    cashoutResponse: EWalletCashoutTransactionItem = {
        amount: 0,
        bank_acc_no: '',
        bank_name: '',
        id: 0,
        outlet_id: '',
        partner_id: '',
        ref_no: '',
        request_no: '',
        response_status: 0,
        status: '',
        status_description: '',
        transaction_date: ''
    }
    private sessionId: string | null | undefined
    public availableBalance = '';
    public showOTPErrorMessage = false;
    public showAmountErrorMessage = false;
    public showPinErrorMessage = false;
    public disableResend = true;
    public otpMessage = '';
    public disableCashout = false;
    public otpResponse: OTPResponseEwallet = {
        security_code: '',
        session_id: '',
        message: '',
        otp: ''
    }

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        private eWalletService: EwalletService,
        private thresholdService: ThresholdService,
        private modalService: NgbModal,
        private _activatedRoute: ActivatedRoute,
        private location: Location,
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        private authService: AuthService,
    ) { }

    ngOnInit() {
        this.sessionId = this.route.snapshot.paramMap.get('login_session_id'),
            this.getDealerRetrieve();

        this.loadOutlets();
        this.isDealerOwner = this.localStorageService.isDealerOwner();
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params && params.reasonCodeType !== undefined) {
                const response: PaymentResponse = {
                    paymentMethod: params.paymentMethod,
                    outletId: params.outletId,
                    amount: params.amount,
                    orderId: params.orderId,
                    reasonCode: params.reasonCode,
                    reasonCodeType: params.reasonCodeType,
                    signature2: params.signature2,
                };
                this.paymentResponse = response;
                // check success
                if (params.reasonCodeType == 'Successful') {
                    // open success popup
                    this.eWalletService
                        .getEwalletBalanceStatus(response.outletId)
                        .subscribe((res) => {
                            this.balanceStatus = res;
                            this.open(this.modalSuccessful, { backdrop: 'static' });
                        });
                } else {
                    this.open(this.modalUnsuccessful, { backdrop: 'static' });
                }
                this.location.replaceState('/store/ewallet');
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void { }

    /**
     * Gets ewallet balance status
     */
    getEWalletBalanceStatus() {
        this.eWalletService
            .getEwalletBalanceStatusRes(this.topUpFormData.outlet_id)
            .toPromise()
            .then((res: BalanceStatus) => {
                if (res.account_status == 'Active') {
                    // initialize
                    this.initiateTransferRequest();
                } else {
                    this.failToTopUp();
                }
            })
            .catch((err) => {
                this.failToTopUp();
            });
    }

    getAvailableBalance() {
        this.eWalletService
            .getEwalletBalanceStatus(this.dealerRetrieve.outlet_id)
            .subscribe((res) => {
                this.availableBalance = res.available_balance;
            });
    }

    failToTopUp = () => {
        this.open(this.modalInactiveOutlet, { backdrop: 'static' });
    };

    /**
     * Initiates transfer request
     */
    initiateTransferRequest() {
        this.eWalletService
            .initiateWalletTransfer(this.topUpFormData)
            .subscribe((transferRequestRes) => {
                this.transferRequestResponse = transferRequestRes;
                this.changeDetectorRef.detectChanges();
                // this.submitFormData();
                this.open(this.modalConfirmTopUp, { backdrop: 'static' });
            });
    }

    confirmPayment = () => {
        // call the confirm api and submit the form
        this.eWalletService
            .confirmPayment(this.topUpFormData.outlet_id, this.transferRequestResponse.orderId)
            .toPromise()
            .then(() => {
                this.submitFormData();
            })
            .catch((err) => console.log(err));
    };

    submitFormData = () => {
        setTimeout(() => {
            if (
                this.paymentFormElement !== undefined &&
                this.transferRequestResponse !== undefined &&
                this.transferRequestResponse.orderId.length > 0
            ) {
                this.paymentFormElement.nativeElement.submit();
            }
        }, 2000);
    };

    /**
     * Loads outlets
     */
    loadOutlets() {
        const outletString = localStorage.getItem(StorageSettings.OUTLETS);
        if (outletString != null) {
            this.outletList = JSON.parse(outletString);
            this.topUpFormData.outlet_id = this.outletList[0].outlet_id;
            this.changeDetectorRef.detectChanges();
        }
    }

    open(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        this.getOutletById();
        this.modalService.open(content, modalOptions).result.then(
            (result) => {
                console.log(`Closed with: ${result}`);
            },
            (reason) => {
                console.log(`Dismissed ${this._getDismissReason(reason)}`);
            }
        );
    }

    _getDismissReason(reason: unknown): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    /**
     * Gets outlet by id
     */
    getOutletById() {
        if (this.outletList != null) {
            this.outletList.forEach((value) => {
                if (value.outlet_id === this.topUpFormData.outlet_id) {
                    this.selectedOutletName = value.outlet_name;
                }
            });
        }
    }

    getOutlet = (outletId: string) => {
        let returnVal = '';
        if (this.outletList != null) {
            this.outletList.forEach((value) => {
                if (value.outlet_id === outletId) {
                    returnVal = value.outlet_name;
                }
            });
        }

        return returnVal;
    };

    // validate pin on confirm
    confirmCashOut() {
        if (this.validateAmount()) {
            const encryptedPin = this.encryptUsingAES256(this.pinNumber);
            this.eWalletService.validatePin(this.dealerRetrieve.outlet_id, encryptedPin).subscribe((response) => {
                this.referenceNumber = response.reference_number;
                this.showOTPErrorMessage = false;
                this.otpMessage = '';
                this.disableResend = true;
                this.open(this.modalOTP, { backdrop: 'static' });
                this.sendCode();
                this.startTimer();
            }, (error) => {
                this.open(this.modalCashOutErrorMessages, { backdrop: 'static' });
                this.cashoutErrorMessage = error.error.errorMessage;
                if (error.error.code == 1003) {
                    this.showPinErrorMessage = true;
                } else if (error.error.code == 1004) {
                    this.disableCashout = true;
                } else {
                }
            });
        } else {
            this.open(this.modalCashOutErrorMessages, { backdrop: 'static' });
        }
    }

    validateAmount(): boolean {
        if (this.cashOutAmount >= +this.availableBalance) {
            this.cashoutErrorMessage = 'You have exceeded the limit for Cash Out. Please enter different amount to procees';
            this.showAmountErrorMessage = true;
            return false;
        }
        else if (this.cashOutAmount >= (+this.availableBalance - +this.dealerRetrieve.cel_minimum_ewallet_balance)) {
            this.cashoutErrorMessage = 'A minimum balance of RM ' + this.dealerRetrieve.cel_minimum_ewallet_balance + ' should be available in your eWallet to proceed for Cash Out. Please enter differant amount to Cash Out';
            this.showAmountErrorMessage = true;
            return false;
        } else {
            this.showAmountErrorMessage = false;
            return true;
        }
    }

    validateEligible() {
        this.confirmCashOut();
        // this.eWalletService.validateEligible(
        //     this.dealerRetrieve.outlet_id,
        //     this.localStorageService.get(StorageSettings.LOGIN_NAME).toString())
        //     .subscribe(() => {
        //         this.confirmCashOut();
        //     }, (error) => {
        //         this.cashoutErrorMessage = error.error.errorMessage;
        //         this.open(this.modalCashOutErrorMessages, { backdrop: 'static' });
        //     });
    }

    // pin encryption
    encryptUsingAES256(text: string): any {
        const key = CryptoJS.enc.Utf8.parse('xaeDftEfyH123456');
        const iv = CryptoJS.enc.Utf8.parse('64ddce385d80c1b4');
        const encrypted = CryptoJS.AES.encrypt(text,
            key, {
            keySize: 128 / 8,
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    }

    // start OTP timer
    startTimer() {
        clearInterval(this.interval);
        this.timeLeft = 180;
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.minutes = Math.floor(this.timeLeft % 3600 / 60);
                this.seconds = Math.floor(this.timeLeft % 60);
            } else {
                this.disableResend = false;
                this.otpMessage = 'Timeout, OTP is expired. ';
                this.changeDetectorRef.detectChanges();
            }
        }, 1000);
    }

    // get dealer details
    getDealerRetrieve() {
        this.thresholdService.getThresholdDetails(
            (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id,
            this.localStorageService.get(StorageSettings.LOGIN_NAME)).subscribe((response) => {
                this.dealerRetrieve = response;
                this.getAvailableBalance();
                this.changeDetectorRef.detectChanges();
            });
    }

    // send OTP to user after Pin Validate
    sendCode() {
        const request: OTPRequestEwallet = {
            deliver_to: this.dealerRetrieve.cell_phone,
            delivery_method: 'SMS'
        }
        this.authService.sendOTPEwallet(request)
            .subscribe(res => {
                if (res) {
                    this.otpResponse = res;
                }
            }, error => {
                this.otpErrorMessage = error.error.errorMessage;
            });
    }

    // resend OTP
    resendCode() {
        const request: OTPRequestEwallet = {
            deliver_to: this.dealerRetrieve.cell_phone,
            delivery_method: 'SMS'
        }
        this.authService.sendOTPEwallet(request)
            .subscribe(res => {
                this.otpResponse = res;
                this.startTimer();
                this.disableResend = true;
                this.otpMessage = 'New code requested. ';
            });

    }

    // OTP onConfirm Click
    confirmOTP() {
        this.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6
        if (this.otp != null) {
            this.validateOTPRequest = {
                otp : this.otp,
                security_code: this.otpResponse.security_code,
                session_id: this.otpResponse.session_id
            };
            this.authService.validateOTPEwallet(this.validateOTPRequest,)
                .subscribe(res => {
                    this.showOTPErrorMessage = false;
                    this.modalService.dismissAll();
                    this.cashoutTransaction();
                }, error => {
                    this.showOTPErrorMessage = true;
                });

        } else {
        }
    }

    cashoutTransaction() {
        console.log(this.referenceNumber + this.pinNumber);
        const encryptedPin = this.encryptUsingAES256(this.referenceNumber + this.pinNumber);
        const cashoutRequest: CashoutRequestDto = {
            amount: this.cashOutAmount,
            pinNo: encryptedPin,
            partnerId: this.dealerRetrieve.partner_sap_id
        }
        const cashoutObj: CashoutRequest = {
            cashOutRequestDataDTO: cashoutRequest
        }
        this.eWalletService.eWalletCashout(
            this.localStorageService.get(StorageSettings.LOGIN_NAME).toString(),
            this.dealerRetrieve.outlet_id,
            cashoutObj).subscribe((response) => {
                this.cashoutResponse = response.cashOutTransaction;
                this.modalService.dismissAll();
                this.showSummary.emit(true);
                this.setTransactionItem.emit(this.cashoutResponse);
            }, (error) => {
                this.open(this.modalCashOutErrorMessages, { backdrop: 'static' });
                this.cashoutErrorMessage = error.error.errorMessage;
            });
    }

    onChangeOTP(event: number) {
        if (event == 1) {
            const myTextBox = document.getElementById('pin2');
            myTextBox?.focus();
        } else if (event == 2) {
            const myTextBox = document.getElementById('pin3');
            myTextBox?.focus();
        } else if (event == 3) {
            const myTextBox = document.getElementById('pin4');
            myTextBox?.focus();
        } else if (event == 4) {
            const myTextBox = document.getElementById('pin5');
            myTextBox?.focus();
        } else if (event == 5) {
            const myTextBox = document.getElementById('pin6');
            myTextBox?.focus();
        } else {
            const myTextBox = document.getElementById('pin6');
            myTextBox?.blur();
        }
    }

    onChangeAmount() {
        this.showAmountErrorMessage = false;
    }

    onChangePin() {
        this.showPinErrorMessage = false;
    }

}
