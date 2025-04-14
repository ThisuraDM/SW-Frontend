import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    Bank,
    CnuSaveRequest,
    CNUSubmitDetails,
    PaymentMethod,
    PaymentSource,
    ReceiptDetailsBank,
    TransactionType,
} from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu';
import { CnuService } from '@app/SW-layout/store/services/bc-cnu-cpd-management/cnu.service';
import { SubmitedCnuService } from '@app/SW-layout/store/services/bc-cnu-cpd-management/submited-cnu.service';
import { ToastService } from '@common/services';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'SW-cnu',
    templateUrl: './cnu.component.html',
    styleUrls: ['./cnu.component.scss'],
})
export class CnuComponent implements OnInit {

    @Output() viewReport = new EventEmitter();

    public step: 'submission-details' | 'customer-details' |
        'receipt-details' | 'review-submission' = 'submission-details';
    public displayedScreen: 'wizard' | 'after-submit' = 'wizard';

    public bankList = new Array<Bank>();
    public paymentSourceList = new Array<PaymentSource>();
    public transactionTypeList = new Array<TransactionType>();
    public paymentMethodList = new Array<PaymentMethod>();
    public receiptDetailsBankList = new Array<ReceiptDetailsBank>();

    public outletStoreDetails?: Outlets;
    public cnuSubmitDetails?: CNUSubmitDetails;

    public step1Form = new FormGroup({});
    public step2Form = new FormGroup({});
    public step3Form = new FormGroup({});
    public step4Form = new FormGroup({});

    constructor(
        private router: Router,
        private toastService: ToastService,
        private cnuService: CnuService,
        private localStorageService: LocalStorageService,
        private submitedCnuService: SubmitedCnuService,
        private satisfactionSurveyService: SatisfactionSurveyService,
    ) {
    }

    ngOnInit(): void {
        this.initializeForm();
        this.retrievePageLoadData();
    }

    get minDate(): { year: number, month: number, day: number } {
        const today = new Date();
        const lastMonthDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
        return { year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: lastMonthDate.getDate() };
    }

    get currentDate(): { year: number, month: number, day: number } {
        const today = new Date();
        return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    }

    get nextDate(): Date {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    }

    onStep1NextButtonClick(): void {
        if (this.step1Form.invalid) {
            this.step1Form.markAllAsTouched();
            return;
        }
        this.cnuSubmitDetails = {
            ...this.cnuSubmitDetails,
            bank_in_to: this.bankList.find(bank => bank.id === +this.step1Form.controls.bankInTo.value) as Bank,
            source_of_payment: this.paymentSourceList.find(
                source => source.id === +this.step1Form.controls.sourceOfPayment.value,
            ) as PaymentSource,
            outlet_store_code_id: this.step1Form.controls.outletStoreCodeId.value,
            outlet_name: this.step1Form.controls.outletName.value,
            cnu_collection_date: this.step1Form.controls.cnuCollectionDate.value,
        };
        this.step = 'customer-details';
    }

    onStep2NextButtonClick(): void {
        if (this.step2Form.invalid) {
            this.step2Form.markAllAsTouched();
            return;
        }
        this.cnuSubmitDetails = {
            ...this.cnuSubmitDetails,
            type_of_transaction: this.transactionTypeList
                .find(type => type.id === +this.step2Form.controls.typeOfTransaction.value) as TransactionType,
            customer_name: this.step2Form.controls.customerName.value,
            ic_number: this.step2Form.controls.iCNumber.value,
            registered_mobile_number: this.step2Form.controls.registeredMobileNumber.value,
            sim_card_number: this.step2Form.controls.sIMCardNumber.value,
            imei_number: this.step2Form.controls.iMEINumber.value,
            material_code: this.step2Form.controls.materialCode.value,
            staff_name: this.step2Form.controls.staffName.value,
        };
        this.step = 'receipt-details';
    }

    onStep3PaymentMethodChange(value: number): void {
        this.step3Form.controls.chequeNumber.clearValidators();
        this.step3Form.controls.bankName.clearValidators();

        if (+value === 2) {
            this.step3Form.controls.chequeNumber.setValidators([
                Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^[0-9]*$/)
            ]);
            this.step3Form.controls.bankName.setValidators([Validators.required]);
        }
        this.step3Form.controls.chequeNumber.updateValueAndValidity();
        this.step3Form.controls.bankName.updateValueAndValidity();
    }

    onStep3NextButtonClick(): void {
        if (this.step3Form.invalid) {
            this.step3Form.markAllAsTouched();
            return;
        }
        this.cnuSubmitDetails = {
            ...this.cnuSubmitDetails,
            official_receipt_number: this.step3Form.controls.officialReceiptNumber.value,
            official_receipt_amount: this.step3Form.controls.officialReceiptAmount.value,
            payment_method: this.paymentMethodList.find(method => method.id === +this.step3Form.controls.paymentMethod.value),
            cheque_number: +this.step3Form.controls.paymentMethod.value === 2 ? this.step3Form.controls.chequeNumber.value : null,
            bank_name: +this.step3Form.controls.paymentMethod.value === 2 ?
                this.receiptDetailsBankList.find(bank => bank.id === +this.step3Form.controls.bankName.value) : null,
        };
        this.step = 'review-submission';
    }

    onStep4SubmitClick(): void {
        if (this.step4Form.invalid) {
            this.step4Form.markAllAsTouched();
            return;
        }
        this.cnuService.saveCNU(this.setSaveRequest())
            .subscribe(response => {
                if (response.amount) {
                    this.toastService.show('CNU Submitted successfully', 'CNU Submitted. Back office has captured all the submitted data');
                    this.submitedCnuService.addNewCNUItem();
                    this.displayedScreen = 'after-submit';
                    // create eligibility first time and add trigger point
                    this.satisfactionSurveyService.show("CNU_CPD_BC")
                } else {
                    this.toastService.show('CNU Submission failed', 'CNU Submission failed. Please try again');
                }
            });
    }

    onSubmitMoreClick(): void {
        this.router.navigateByUrl('/store', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/store/cnu-cpd-bc']);
        });
    }
    onViewReport(){
        this.viewReport.emit();
    }

    private initializeForm(): void {
        this.step1Form = new FormGroup({
            bankInTo: new FormControl(null, { validators: [Validators.required] }),
            sourceOfPayment: new FormControl(null, { validators: [Validators.required] }),
            outletStoreCodeId: new FormControl(null, { validators: [] }),
            outletName: new FormControl(null, { validators: [] }),
            cnuCollectionDate: new FormControl(null, { validators: [Validators.required] }),
        });
        this.step2Form = new FormGroup({
            typeOfTransaction: new FormControl(null, { validators: [Validators.required] }),
            customerName: new FormControl(null, { validators: [
                Validators.required, Validators.maxLength(100), Validators.pattern(/^(?!\s+$)[a-zA-Z. ]*$/)
                ] }),
            iCNumber: new FormControl(null, { validators: [Validators.required, Validators.minLength(12), Validators.maxLength(12)] }),
            registeredMobileNumber: new FormControl(null, { validators: [Validators.minLength(11), Validators.maxLength(11)] }),
            sIMCardNumber: new FormControl(null, { validators: [
                Validators.minLength(18), Validators.maxLength(18), Validators.pattern(/^[0-9]*$/)
                ] }),
            iMEINumber: new FormControl(null, { validators: [
                Validators.minLength(15), Validators.maxLength(15), Validators.pattern(/^[0-9]*$/)
                ] }),
            materialCode: new FormControl(null, { validators: [Validators.maxLength(30)] }),
            staffName: new FormControl(null, { validators: [] }),
        });
        this.step3Form = new FormGroup({
            officialReceiptNumber: new FormControl(null, { validators: [Validators.required, Validators.maxLength(20)] }),
            officialReceiptAmount: new FormControl(null, {
                validators: [
                    Validators.required, Validators.maxLength(20), Validators.min(0.01), Validators.pattern(/^[0-9]{1,10}(\.[0-9]{1,2})?$/),
                ],
            }),
            paymentMethod: new FormControl(null, { validators: [Validators.required] }),
            chequeNumber: new FormControl(null, { validators: [] }),
            bankName: new FormControl(null, { validators: [] }),
        });
        this.step4Form = new FormGroup({
            addRemarks: new FormControl(null, { validators: [Validators.maxLength(100)] }),
        });
    }

    private retrievePageLoadData(): void {
        this.retrieveBankList();
        this.retrievePaymentSourceList();
        this.retrieveTransactionTypeList();
        this.retrievePaymentMethodList();
        this.retrieveReceiptDetailsBankList();
        this.outletStoreDetails = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0] ?? null;
        this.setDefaultFormValues();
    }

    private retrieveBankList(): void {
        this.cnuService.getBankList().subscribe((response: Array<Bank>) => {
            this.bankList = response;
        });
    }

    private retrievePaymentSourceList(): void {
        this.cnuService.getPaymentSourceList().subscribe((response: Array<PaymentSource>) => {
            this.paymentSourceList = response;
        });
    }

    private retrieveTransactionTypeList(): void {
        this.cnuService.getTransactionTypeList().subscribe((response: Array<TransactionType>) => {
            this.transactionTypeList = response;
        });
    }

    private retrievePaymentMethodList(): void {
        this.cnuService.getPaymentMethodList().subscribe((response: Array<PaymentMethod>) => {
            this.paymentMethodList = response;
        });
    }

    private retrieveReceiptDetailsBankList(): void {
        this.cnuService.getReceiptDetailsBankList().subscribe((response: Array<ReceiptDetailsBank>) => {
            this.receiptDetailsBankList = response;
        });
    }

    private setDefaultFormValues(): void {
        this.step1Form.patchValue({
            outletStoreCodeId: this.outletStoreDetails?.outlet_id,
            outletName: this.outletStoreDetails?.outlet_name,
            cnuCollectionDate: this.currentDate,
        });
        this.step2Form.patchValue({
            staffName: this.localStorageService.get(StorageSettings.NAME)
        });
    }

    private setSaveRequest(): CnuSaveRequest {
        return {
            amount: +this.step3Form.value.officialReceiptAmount,
            bank_id: +this.step1Form.value.bankInTo,
            cheque_no: +this.step3Form.value.paymentMethod === 2 ? +this.step3Form.value.chequeNumber : null,
            cnu_collection_date: this.setCNUCollectionDate(),
            customer_name: this.step2Form.value.customerName?.trim(),
            ic_number: this.step2Form.value.iCNumber?.trim(),
            imei_number: this.step2Form.value.iMEINumber,
            material_code: this.step2Form.value.materialCode?.trim(),
            mobile_number: this.step2Form.value.registeredMobileNumber?.trim(),
            outlet_name: this.step1Form.value.outletName,
            payment_method_id: +this.step3Form.value.paymentMethod,
            payment_source_id: +this.step1Form.value.sourceOfPayment,
            receipt_details_bank_id: +this.step3Form.value.paymentMethod === 2 ? +this.step3Form.value.bankName : null,
            receipt_no: this.step3Form.value.officialReceiptNumber?.trim(),
            remarks: this.step4Form.value.addRemarks?.trim(),
            sim_number: this.step2Form.value.sIMCardNumber,
            staff_name: this.step2Form.value.staffName,
            // status: 'Pending',
            store_code_id: this.step1Form.value.outletStoreCodeId,
            transaction_type_id: +this.step2Form.value.typeOfTransaction,
        };
    }

    private setCNUCollectionDate(): Date {
        const selectedDate: { year: number, month: number, day: number } = this.step1Form.value.cnuCollectionDate;
        const date = new Date();
        return new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day,date.getHours(),date.getMinutes(),date.getMilliseconds());
    }
}
