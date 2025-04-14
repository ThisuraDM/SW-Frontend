import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    Bank, CnuSaveRequest, CNUSubmitDetails, CNUUpdateDetails,
    PaymentMethod,
    PaymentSource, ReceiptDetailsBank,
    TransactionType,
} from '@app/SW-layout/store/models/bc-cnu-cpd-management/cnu';
import { CnuService } from '@app/SW-layout/store/services/bc-cnu-cpd-management/cnu.service';
import { ToastService } from '@common/services';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'SW-cnu-update',
  templateUrl: './cnu-update.component.html',
  styleUrls: ['./cnu-update.component.scss']
})
export class CnuUpdateComponent implements OnInit {

    @Input() cnuId = 0;
    @Output() cancelClick = new EventEmitter();
    @Output() afterUpdate = new EventEmitter();

    public steps = ['Submission Details', 'Customer Details', 'Receipt Details', 'Review Submission'];
    public selectedStep = 0;

    public bankList = new Array<Bank>();
    public paymentSourceList = new Array<PaymentSource>();
    public transactionTypeList = new Array<TransactionType>();
    public paymentMethodList = new Array<PaymentMethod>();
    public receiptDetailsBankList = new Array<ReceiptDetailsBank>();

    public cnuSubmitDetails?: CNUSubmitDetails;

    public step1Form = new FormGroup({});
    public step2Form = new FormGroup({});
    public step3Form = new FormGroup({});
    public step4Form = new FormGroup({});

    public isUpdateCompleted = false;

  constructor(
      private cnuService: CnuService,
      private toastService: ToastService,
  ) { }

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
        this.selectedStep = 1;
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
        this.selectedStep = 2;
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
        this.selectedStep = 3;
    }

    onStep4SubmitClick(): void {
        if (this.step4Form.invalid) {
            this.step4Form.markAllAsTouched();
            return;
        }
        this.cnuService.updateCNU(this.setSaveRequest(), this.cnuId)
            .subscribe(response => {
                if (response.amount) {
                    this.isUpdateCompleted = true;
                } else {
                    this.toastService.show('CNU update failed', 'CNU Update failed. Please try again');
                }
            });
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
        const bankList$ = this.retrieveBankList();
        const paymentSourceList$ = this.retrievePaymentSourceList();
        const transactionTypeList$ = this.retrieveTransactionTypeList();
        const paymentMethodList$ = this.retrievePaymentMethodList();
        const receiptDetailsBankList$ = this.retrieveReceiptDetailsBankList();
        const cnuDetails$ = this.retrieveCNUDetails();

        forkJoin([bankList$, paymentSourceList$, transactionTypeList$, paymentMethodList$, receiptDetailsBankList$, cnuDetails$])
            .subscribe(response => {
                this.bankList = response[0] as Array<Bank>;
                this.paymentSourceList = response[1] as Array<PaymentSource>;
                this.transactionTypeList = response[2] as Array<TransactionType>;
                this.paymentMethodList = response[3] as Array<PaymentMethod>;
                this.receiptDetailsBankList = response[4] as Array<ReceiptDetailsBank>;
                this.setDefaultFormValues(response[5] as CNUUpdateDetails);
            });
    }

    private retrieveBankList(): Observable<Array<Bank>> {
        return this.cnuService.getBankList();
    }

    private retrievePaymentSourceList(): Observable<Array<PaymentSource>> {
        return this.cnuService.getPaymentSourceList();
    }

    private retrieveTransactionTypeList(): Observable<Array<TransactionType>> {
        return this.cnuService.getTransactionTypeList();
    }

    private retrievePaymentMethodList(): Observable<Array<PaymentMethod>> {
        return this.cnuService.getPaymentMethodList();
    }

    private retrieveReceiptDetailsBankList(): Observable<Array<ReceiptDetailsBank>> {
        return this.cnuService.getReceiptDetailsBankList();
    }

    private retrieveCNUDetails(): Observable<CNUUpdateDetails> {
      return this.cnuService.getCNUById(this.cnuId);
    }

    private setDefaultFormValues(defaultData: CNUUpdateDetails): void {
        this.step1Form.patchValue({
            bankInTo: defaultData?.bank_id,
            sourceOfPayment: defaultData?.payment_source_id,
            outletStoreCodeId: defaultData?.store_code_id,
            outletName: defaultData?.outlet_name,
            cnuCollectionDate: this.convertISODateToDateObject(defaultData?.cnu_collection_date),
        });
        this.step2Form.patchValue({
            typeOfTransaction: defaultData?.transaction_type_id,
            customerName: defaultData?.customer_name,
            iCNumber: defaultData?.ic_number,
            registeredMobileNumber: defaultData?.mobile_number,
            sIMCardNumber: defaultData?.sim_number,
            iMEINumber: defaultData?.imei_number,
            materialCode: defaultData?.material_code,
            staffName: defaultData?.staff_name
        });
        this.step3Form.patchValue({
            officialReceiptNumber: defaultData?.receipt_no,
            officialReceiptAmount: defaultData?.amount,
            paymentMethod: defaultData?.payment_method_id,
            chequeNumber: defaultData?.cheque_no,
            bankName: defaultData?.receipt_details_bank_id
        });
        this.step4Form.patchValue({
            addRemarks: defaultData?.remark
        });
        this.onStep3PaymentMethodChange(defaultData?.payment_method_id);
    }

    private convertISODateToDateObject(isoDate: Date): { year: number, month: number, day: number } {
      const date = new Date(isoDate);
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}
    }

    private setSaveRequest(): CnuSaveRequest {
        return {
            amount: +this.step3Form.value.officialReceiptAmount,
            bank_id: +this.step1Form.value.bankInTo,
            cheque_bank_id: +this.step3Form.value.paymentMethod === 2 ? +this.step3Form.value.bankName : null,
            cheque_no: +this.step3Form.value.paymentMethod === 2 ? +this.step3Form.value.chequeNumber : null,
            cnu_collection_date: this.setCNUCollectionDate(),
            customer_name: this.step2Form.value.customerName?.trim(),
            ic_number: this.step2Form.value.iCNumber?.trim(),
            imei_number: this.step2Form.value.iMEINumber,
            material_code: this.step2Form.value.materialCode?.trim(),
            mobile_number: this.step2Form.value.registeredMobileNumber,
            payment_method_id: +this.step3Form.value.paymentMethod,
            payment_source_id: +this.step1Form.value.sourceOfPayment,
            receipt_no: this.step3Form.value.officialReceiptNumber?.trim(),
            remarks: this.step4Form.value.addRemarks?.trim(),
            sim_number: this.step2Form.value.sIMCardNumber,
            transaction_type_id: +this.step2Form.value.typeOfTransaction,
        };
    }

    private setCNUCollectionDate(): Date {
        const selectedDate: { year: number, month: number, day: number } = this.step1Form.value.cnuCollectionDate;
        return new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
    }

}
