import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import {
    DeviceThreshold,
    DeviceThresholdWithdrawalRequest,
    DeviceThresholdWithdrawalResponse,
} from '@app/SW-layout/store/models/threshold/device-threshold';
import { ToastService } from '@common/services';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'services/local-storage.service';

import { DealerThresholdService } from '../../../services/threshold/dealer-threshold.service';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';
import { Router } from '@angular/router';
import { DuplicateTabService } from 'services/duplicate-tab-service.service';

@Component({
    selector: 'SW-dealer-excess-threshold-withdrawal',
    templateUrl: './dealer-excess-threshold-withdrawal.component.html',
    styleUrls: ['./dealer-excess-threshold-withdrawal.component.scss']
})
export class DealerExcessThresholdWithdrawalComponent implements OnInit {
    @ViewChild('modalProcessWithdrawal', { static: true }) modalProcessWithdrawal!: TemplateRef<any>;
    @ViewChild('modalTimeOut', { static: true }) modalTimeOut!: TemplateRef<any>;
    public loaded=false
    public customerCode = '';
    public userOutlets: Outlets[] = [];
    public selectedStore = '';
    public withdrawalAmount =0 ;
    public amountValidated = false;
    public viewWithdrawalExcessThreshold = false
    public viewTransactionDetails = false
    public allAmount = false
    public allowWithdrwal = false
    public isLoaded = false
    public errorMessage ='It seems like there is an issue getting the data. Please refresh.'
    public dealerDeviceThresholdDetails : DeviceThreshold ={
        available_threshold: 0,
        device_security_deposit: 0,
        device_top_up_security: 0,
        enable_withdraw: false,
        excess_threshold: 0,
        outlet_id: '',
        payment_due_amount: 0,
        total_device_threshold_limit: 0,
        utilized_threshold: 0,
        virtual_account: '',
        sap_customer_code: '',
    }

    public deviceThresholdWithdrawalRequest: DeviceThresholdWithdrawalRequest= {
        approved_amount: '',
        id: '',
        ins_area: '',
        name: '',
        operation: '',
        outlet_id: '',
        owner: '',
        payment_amount: '',
        payment_type: '',
        reference: '',
        reference_id: '',
        remarks: '',
        status: '',
        transaction_id: '',
        transaction_type: '',
        tt_source: '',
        type: '',
        cust_code: ''
    }
    
	 public disableSubmit = false;

    public validationMessage =''
    public requestResponse: DeviceThresholdWithdrawalResponse ={
        account_id: '',
        available_threshold: '',
        SW_customer_code: '',
        SW_sap_id: '',
        excess_threshold: '',
        status: '',
        payment_amount: '699',
        transaction_id: 'jhdskdj'
    }

    constructor(
        private localStorageService: LocalStorageService,
        private dealerThresholdService: DealerThresholdService,
        private toastService:ToastService,
        private modalService: NgbModal,
        private satisfactionSurveyService: SatisfactionSurveyService,
        private router: Router,
        private duplicateTabService: DuplicateTabService,
    ) { }

    ngOnInit(): void {
        this.duplicateTabService.checkDuplicateTabs();
        const permissions = this.localStorageService.getPermissions();
        this.allowWithdrwal = permissions.includes('EXCESS_WITHDRAWAL_DEALER')
        this.userOutlets = (this.localStorageService.getOutlets() as Array<Outlets>);
        this.selectedStore = this.userOutlets[0].outlet_id;
        this.getDeviceThresholdDetailsDealer()
    }

    getDeviceThresholdDetailsDealer = () => {
        this.isLoaded = false
        this.viewTransactionDetails = false;
        const selectedOutlet =  this.userOutlets.filter(outlet =>  outlet.outlet_id === this.selectedStore)
        const request ={
            request_body: {
              cust_code: 'CUST-CODE',
              order_type: 'Credit'
            },
            request_header: {
              event_name: 'PaymentDueDetails',
              source_system: 'SW'
            }
          }
        const outletsID = this.selectedStore;
        this.dealerThresholdService.getDeviceThresholdDealer(outletsID, request).subscribe(response => {
            if(response && Object.keys(response).length !== 0){
                this.dealerDeviceThresholdDetails = response[0]
                // setting minimum amount
                this.customerCode = this.dealerDeviceThresholdDetails.sap_customer_code;
                this.withdrawalAmount = 500
                this.isLoaded= true
                this.satisfactionSurveyService.show("THRESHOLD")
            }
          }, err=>{
              if(err.status !== undefined && err.status === 408){
                this.openModal(this.modalTimeOut, { backdrop: 'static' })
              }else{
                  this.isLoaded= true
                  this.toastService.show('Error', 'Unable to retrieve device threshold details.')
              }
          });
    }

    withdrawExcessThreshold = () =>{
        this.viewWithdrawalExcessThreshold = true
    }

    cancelWithdrawalRequest = ()=> {
        this.viewWithdrawalExcessThreshold = false
    }

    addAllAmount = (val: boolean) => {
        this.allAmount = !val
        this.withdrawalAmount = Math.floor(this.dealerDeviceThresholdDetails.excess_threshold / 100) * 100;
    }

    showTransactionDetails = ()=>{
        this.viewTransactionDetails = !this.viewTransactionDetails
    }


    validateExcessAmount =()=>{
        const excess = this.withdrawalAmount %100
        this.withdrawalAmount =  this.withdrawalAmount - excess
        if (this.withdrawalAmount < 500) {
            this.validationMessage = 'The minimum withdraw amount is RM500 and multiple of RM100';
            this.amountValidated = false;
        } else if (this.withdrawalAmount > this.dealerDeviceThresholdDetails.excess_threshold) {
            this.validationMessage = 'You have exceeded the maximum withdrawable amount';
            this.amountValidated = false;
        }
        // else if (this.withdrawalAmount > this.dealerDeviceThresholdDetails.payment_due_amount) {
        //     this.amountValidated = false;
        //     this.validationMessage = 'Withdrawal amount should be less than the payment due amount';
        // }
         else {
            this.amountValidated = true;
            this.validationMessage = '';
        }
    }

    withdrawExcessThresholdRequest = () => {

        const outletsID = this.selectedStore;
        // validation
        this.validateExcessAmount()
        // check for validity
        if(this.amountValidated){
            this.disableSubmit = true;
            this.deviceThresholdWithdrawalRequest =
            {...this.deviceThresholdWithdrawalRequest, approved_amount : this.withdrawalAmount.toString()}
            this.deviceThresholdWithdrawalRequest.cust_code = this.customerCode;
            this.dealerThresholdService.deviceThresholdWithdrawalRequest(this.deviceThresholdWithdrawalRequest, outletsID)
            .subscribe(res => {
                if(res.length > 0){
                    this.requestResponse = res[0]
                    // show pop up
                    this.disableSubmit = false;
                    this.openModal(this.modalProcessWithdrawal, { backdrop: 'static' })
                }
            }, err=>{
                this.disableSubmit = false;
                this.toastService.show('Error', 'Unable submitted withdrawal request.')
            })
        }
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

      openModal(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        this.modalService.open(content, modalOptions).result.then(
          (result) => {
            console.log(`Closed with: ${result}`);
          },
          (reason) => {
            console.log(`Dismissed ${this._getDismissReason(reason)}`);
          }
        );
      }

    confirmPopup (){
        // close the pop up and trigger get threshold details api.
        this.getDeviceThresholdDetailsDealer()
        this.viewWithdrawalExcessThreshold = false
        this.modalService.dismissAll('On confirm')
    }

    closeAlert(){
        this.modalService.dismissAll()
    }

    refresh(){
        location.reload()
    }

    onBackClick(){
        this.viewTransactionDetails = false
    }
}
