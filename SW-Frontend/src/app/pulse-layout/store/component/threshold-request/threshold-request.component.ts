import { BankInType } from './../../models/threshold/bank-in-type';
import { ThresholdService } from './../../services/threshold/threshold.service';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { PaymentChannel } from '../../models/threshold/payment-channel';
import { ReferanceId } from '../../models/threshold/referance-id';
import { FormBuilder, Validators } from '@angular/forms';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';
import { AddCollectionResponce } from '../../models/threshold/add-collection-responce';
import { NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastService } from '@common/services';
import { ThresholdPreviousDetails } from '../../models/threshold/threshold-previous-details';

@Component({
    selector: 'SW-threshold-request',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './threshold-request.component.html',
    styleUrls: ['threshold-request.component.scss'],
})
export class ThresholdRequestComponent implements OnInit {
    bankinTypeList = new Array<BankInType>();
    referanceIDList = new Array<ReferanceId>();
    paymentChannelList = new Array<PaymentChannel>();
    transactionDate = new Date();
    isAttachmentSizeExceeded = false;
    isthreshold30Exceeded = false;


    public collectionForm = this.fb.group({
        bankInType: [null, [Validators.required]],
        amount: ['0.00', [ Validators.required, Validators.maxLength(20), Validators.min(0.00), Validators.pattern(/^[0-9]{1,10}(\.[0-9]{1,2})?$/)]],
        transactionTime: [this.convertDate(this.transactionDate), [Validators.required]],
        referanceID: [null, [Validators.required]],
        paymentChannel: [null, [Validators.required]],
        attachment: [null,{disabled:true}],
        attachmentFile: [null],
        transactionDatePicker: [
            {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}
          ],
        transactionTimePicker: [{
            hour: new Date().getHours(),
            minute: new Date().getMinutes()
          }],

    });
    public isThesholdSubmitted =false;
    public thresholdPreviousDetails?: ThresholdPreviousDetails;
    constructor(private fb: FormBuilder,private thresholdService:ThresholdService,private localStorageService: LocalStorageService,private modalService: NgbModal,public datepipe: DatePipe,private toastService:ToastService) {
    }

    ngOnInit() {
        this.retrieveData();
        this.thresholdService.onthreshold30Exceeded().subscribe(res=>{
            this.isthreshold30Exceeded = res;
        });
        this.thresholdService.onthresholdSubmit().subscribe(res=>{
            this.thresholdService.getThresholdPreviousRequests((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id).subscribe((response) => {
                this.thresholdPreviousDetails=response;
                this.isThesholdSubmitted=response.pending_transaction;
            });
        });
        this.thresholdService.getThresholdPreviousRequests((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id).subscribe((response) => {
            this.thresholdPreviousDetails=response;
            this.isThesholdSubmitted=response.pending_transaction;
        });
        this.collectionForm.controls.transactionTimePicker.valueChanges.subscribe(changes=>{
           if(this.collectionForm.controls.transactionDatePicker.value)
            this.onTimeSelection()
        })
    }
    onSubmit() {
        if (this.collectionForm.status === 'VALID') {
            const formattedDate = `${this.collectionForm.controls.transactionDatePicker.value?.year}-${this.collectionForm.controls.transactionDatePicker.value?.month.toString().padStart(2, '0')}-${this.collectionForm.controls.transactionDatePicker.value?.day.toString().padStart(2, '0')}T${this.collectionForm.controls.transactionTimePicker.value?.hour.toString().padStart(2, '0')}:${this.collectionForm.controls.transactionTimePicker.value?.minute.toString().padStart(2, '0')}:00.179Z`;
            const outlet_id = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id;
            var request = {
                bank_in_amount: parseFloat(this.collectionForm.controls.amount.value),
                bank_in_time: formattedDate,
                bank_in_type_id: parseInt(this.collectionForm.controls.bankInType.value),
                payment_channel_id: parseInt(this.collectionForm.controls.paymentChannel.value),
                reference_id: parseInt(this.collectionForm.controls.referanceID.value),
                store_code_id: outlet_id
              }
              this.thresholdService.addCollection(request).subscribe((response: AddCollectionResponce) => {
                  if(response){
                    if(this.collectionForm.controls.attachmentFile.value){
                    this.thresholdService.uploadAttachment(response.id+'',outlet_id,response.threshold_collection_header.id+'',this.collectionForm.controls.attachmentFile.value).subscribe((response: any) => {
                        if(response){
                            this.thresholdService.addNewCollectionItem();
                        }},(error)=>{
                            this.toastService.show(error.error.errorMessage||'', '');
                          });
                        }else{
                            this.thresholdService.addNewCollectionItem();
                        }
                    this.collectionForm.reset();
                    this.collectionForm.controls.amount.setValue('0.00');
                    this.collectionForm.controls.transactionTime.setValue(this.convertDate(new Date()));
                    this.collectionForm.controls.transactionDatePicker.setValue({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()});
                    this.collectionForm.controls.transactionTimePicker.setValue({
                        hour: new Date().getHours(),
                        minute: new Date().getMinutes()
                      })
                  }
            },(error)=>{
                this.toastService.show(error.error.errorMessage||'', '');
              });
        }

        for (const key in this.collectionForm.controls) {
            const control = this.collectionForm.controls[key];
            control.markAllAsTouched();
        }
    }
    onFileChanged(event:any) {
        this.isAttachmentSizeExceeded = event.target.files[0].size>2000000|| false;
        this.collectionForm.controls.attachment.setValue(event.target.files[0].name);
        this.collectionForm.controls.attachmentFile.setValue(event.target.files[0]);
    }

    openTimePicker(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {

        this.modalService.open(content, modalOptions);
      }
    convertDate(transactionDate:any){
        return `${
            (transactionDate.getMonth()+1).toString().padStart(2, '0')}/${
            transactionDate.getDate().toString().padStart(2, '0')}/${
            transactionDate.getFullYear().toString().padStart(4, '0')} ${
            transactionDate.getHours().toString().padStart(2, '0')}:${
            transactionDate.getMinutes().toString().padStart(2, '0')} ${transactionDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    }
    onDateSelection(date: NgbDate) {
        const dateTime = `${
            (date.month).toString().padStart(2, '0')}/${
            date.day.toString().padStart(2, '0')}/${
            date.year.toString().padStart(4, '0')} ${
            this.collectionForm.controls.transactionTimePicker.value.hour.toString().padStart(2, '0')}:${
            this.collectionForm.controls.transactionTimePicker.value.minute.toString().padStart(2, '0')} ${this.collectionForm.controls.transactionTimePicker.value.hour >= 12 ? 'PM' : 'AM'}`;

        this.collectionForm.controls.transactionTime.setValue(dateTime);

    }
    onTimeSelection(){
        const dateTime = `${
            this.collectionForm.controls.transactionDatePicker.value.month.toString().padStart(2, '0')}/${
            this.collectionForm.controls.transactionDatePicker.value.day.toString().padStart(2, '0')}/${
            this.collectionForm.controls.transactionDatePicker.value.year.toString().padStart(4, '0')} ${
            this.collectionForm.controls.transactionTimePicker.value.hour.toString().padStart(2, '0')}:${
            this.collectionForm.controls.transactionTimePicker.value.minute.toString().padStart(2, '0')} ${this.collectionForm.controls.transactionTimePicker.value.hour >= 12 ? 'PM' : 'AM'}`;

        this.collectionForm.controls.transactionTime.setValue(dateTime);
    }
    thresholdDate(date:string):string{
        if(!date||date==''){
            return '';
        }
        var dateItems =date?.split('T')[0]?.split('-')||[];
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep', 'Oct','Nov','Dec'];
        return `${dateItems[2]||''} ${months[parseInt(dateItems[1])-1]||''} ${dateItems[0]||''}`;
    }
    get minDate(): { year: number, month: number, day: number } {
        const today = new Date();
        const lastMonthDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
        return { year: lastMonthDate.getFullYear(), month: lastMonthDate.getMonth() + 1, day: lastMonthDate.getDate() };
    }

    get currentDate(): { year: number, month: number, day: number } {
        const today = new Date();
        return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    }
    private retrieveData(){
        this.retrieveBankList();
        this.retrievePaymentChannelList();
        this.retrieveReferanIDLIst();
    }
    private retrieveBankList(): void {
        this.thresholdService.getBankInTypeList().subscribe((response: Array<BankInType>) => {
            this.bankinTypeList = response;
        });
    }
    private retrieveReferanIDLIst(): void {
        this.thresholdService.getReferanceIdList().subscribe((response: Array<ReferanceId>) => {
            this.referanceIDList = response;
        });
    }
    private retrievePaymentChannelList(): void {
        this.thresholdService.getPaymentMethodList().subscribe((response: Array<PaymentChannel>) => {
            this.paymentChannelList = response;
        });
    }

}
