import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import {
    CashoutStatus,
    EWalletCashoutTransactionItem,
    EWalletTransactionHistoryData,
    EWalletTransactionItem,
    EWalletTransactionRequest,
    EWalletTransactionResponse,
} from '@app/SW-layout/store/models/e-wallet-transaction-history-data';
import { BalanceStatus, DealerOwnerResponse } from '@app/SW-layout/store/models/ewallet';
import { EWalletTransactionHistoryService } from '@app/SW-layout/store/services/e-wallet-transaction-history.service';
import { EwalletService } from '@app/SW-layout/store/services/ewallet.service';
import { DateRangeService, ToastService } from '@common/services';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Outlets } from 'models/login-details';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { combineLatest, Observable, Subscription } from 'rxjs';

import { StorageSettings } from '../../../../../constants/StorageSettings';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { DealerThresholds } from '../../models/threshold/dealer-thresholds';
import { ThresholdService } from '../../services/threshold/threshold.service';

/**
 * SW e wallet transaction history component
 * Author: Thilina Kelum
 * Created Date: 2021 October 10
 */
@Component({
    selector: 'SW-e-wallet-transaction-history',
    templateUrl: './e-wallet-transaction-history.component.html',
    styleUrls: ['./e-wallet-transaction-history.component.scss'],
})
export class EWalletTransactionHistoryComponent implements OnInit {
    @ViewChild('content', { static: false }) content!: ElementRef;

    @Output() showSummary = new EventEmitter<boolean>();
    @Output() setTransactionItem = new EventEmitter<EWalletCashoutTransactionItem>();

    dataSize = 10;
    page = 1;
    dataFrom = 1;
    dataTo = 1;
    total$!: Observable<number>;
    transactionTypes: string[] = [];
    eWalletTransactionHistoryData: EWalletTransactionHistoryData = {
        transaction_list_data: {
            transaction_item: [],
            number_of_returned: '',
            number_of_total: ''
        },
        bo_completed_time: ''
    };
    filteredTransactionItems: EWalletTransactionItem[] = [];
    outletList: any[] = [];
    statusList : any[]= [];
    eWalletTransactionRequest!: EWalletTransactionRequest;

    subscription: Subscription = new Subscription();
    selectedTransactionType!: string;
    selectedTransactionTypeId!: string;
    selectedOutlet = '';
    selectedDateRange!: string;
    selectedDateRangeString!: string;
    typeCount = 0;
    emailTo!: string;
    selectedStartDate!: string;
    selectedEndDate!: string;
    selectedCashOutStartDate!: Date;
    selectedCashOutEndDate!: Date;
    emailRequired = false;
    balanceStatusResponse!: BalanceStatus;

    outletSettings!: IDropdownSettings;
    transactionSettings!: IDropdownSettings;
    statusSettings!:IDropdownSettings;
    outletsEmpty = false;
    transactionTypesEmpty = false;
    selectedOutlets: any[] = [];
    selectedTransactionTypes: any[] = [];
    requiredFieldEmpty = false;
    public vendorId = '';
    public selectedStatus = '';
    public selectedStatusList :any[] = [];
    public eWalletCashoutList = new Array<EWalletCashoutTransactionItem>();
    public pageNumber = 0;
    public pageSize = 10;
    public totalElements = 0;
    public pageElements = 0;
    dealerRetrieve : DealerThresholds ={
        device_credit_limit: '',
        available_credit_limit: '',
        utilization: '',
        threshold_limit: '',
        cash_out_eligibility: false,
        partner_sap_id: '',
        user_first_name: '',
        cel_minimum_ewallet_balance: '',
        outlet_id:'',
        cel_owner_phone:'',
        cell_phone:''
    }
    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public dateRangeService: DateRangeService,
        private modalService: NgbModal,
        private toastService: ToastService,
        private eWalletTransactionHistoryService: EWalletTransactionHistoryService,
        private localStorageService: LocalStorageService,
        private eWalletService: EwalletService,
        private thresholdService:ThresholdService,
    ) {
        this.outletSettings = {
            singleSelection: true,
            enableCheckAll: false,
            idField: 'outlet_id',
            textField: 'outlet_id',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };
        this.transactionSettings = {
            singleSelection: true,
            enableCheckAll: false,
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };
        this.statusSettings = {
            singleSelection: true,
            enableCheckAll: false,
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };
    }

    ngOnInit() {
        this.selectedTransactionTypeId = 'ALL';
        this.selectedTransactionTypes.push('ALL');
        this.selectedTransactionType = this.selectedTransactionTypes[0];
    
        this.getOwnerIdFromLoginUsersOutlet()
        this.loadOutlets();
        this.loadStatus();
        this.dateRangeService.setRange('THIS_MONTH');
        const eWalletTransactionRequest: EWalletTransactionRequest = {
            outlet_id: this.selectedOutlets[0].outlet_id,
            end_date_time: '',
            start_date_time: '',
            email_required: false,
        };

        this.subscription.add(
            combineLatest([
                this.dateRangeService.selectedDateObject$,
            ]).subscribe(([dateObject]) => {
                if (dateObject.startDate !== dateObject.endDate) {
                    this.selectedStartDate = this.setDate(dateObject.startDate);
                    this.selectedEndDate = this.setDate(dateObject.endDate);
                    this.selectedCashOutStartDate = dateObject.startDate
                    this.selectedCashOutEndDate = dateObject.endDate
                    eWalletTransactionRequest.start_date_time = this.selectedStartDate;
                    eWalletTransactionRequest.end_date_time = this.selectedEndDate;
                }
                console.log(dateObject);
                this.selectedEndDate;
                this.setSelectedDateRange(dateObject.selectedRange);
                this.eWalletTransactionRequest = eWalletTransactionRequest;
                this.getEWalletTransactionHistory(eWalletTransactionRequest);
                this.getDealerRetrieve();
                this.changeDetectorRef.detectChanges();
            })
        );
    }

    setSelectedDateRange(selectedRange: string) {
        this.selectedDateRange = selectedRange;
        switch (selectedRange) {
            case 'THIS_MONTH':
                this.selectedDateRangeString = 'Current Month';
                break;
            case 'LAST_30_DAYS':
                this.selectedDateRangeString = 'Last 30 Days';
                break;
            case 'LAST_60_DAYS':
                this.selectedDateRangeString = 'Last 60 Days';
                break;
            case 'LAST_90_DAYS':
                this.selectedDateRangeString = 'Last 90 Days';
                break;
            case 'CUSTOM':
                this.selectedDateRangeString = 'Custom';
                break;
        }
    }

    /**
     * Gets ewallet transaction history ---
     */
    getEWalletTransactionHistory(eWalletTransactionRequest: EWalletTransactionRequest) {
        this.filteredTransactionItems = [];
        this.eWalletTransactionHistoryService
            .getEWalletTransactionHistory(eWalletTransactionRequest, this.selectedOutlet)
            .subscribe((value: Array<EWalletTransactionItem>) => {
                const types: any[] = [];
                this.eWalletTransactionHistoryData.transaction_list_data.transaction_item = value;
                // if (value.bo_completed_time) {

                // }
                       this.eWalletTransactionHistoryData.transaction_list_data.transaction_item.forEach(
                        (value1) => {
                            types.push(value1.details);
                        }
                    );
                this.transactionTypes = [...new Set(types)];
                this.transactionTypes.unshift('ALL');

                this.internalPagination(0, 1);
            }, error => {
                console.warn('transactions history data lording error');
            });
    }

    setDate(value: Date) {
        const month = '' + (new Date(value).getMonth() + 1);
        const year = new Date(value).getFullYear();
        const day = '' + new Date(value).getDate();

        const modeMonth = month.length === 1 ? '0' + month : '' + month;
        const modeDay = day.length === 1 ? '0' + day : '' + day;

        return year + modeMonth + modeDay + '000000';
    }

    getFirstAndLastDateOfMonth(year: number, month: number, date: number): Date {
        return new Date(year, month, date);
    }

    confirm() {
        this.close();
        this.savePDF();
        const request: any = {
            company_name: this.balanceStatusResponse.account_holder_public_name,
            company_number: this.balanceStatusResponse.account_no,
            date: this.selectedDateRangeString,
            email: this.localStorageService.get(StorageSettings.EMAIL),
            requested_by: this.localStorageService.get(StorageSettings.NAME),
            email_required: this.emailRequired,
            msisdn: 'N/A',
            start_date_time: this.selectedStartDate,
            end_date_time: this.selectedEndDate,
            transaction_type: this.selectedTransactionTypeId === 'ALL' ? null : this.filteredTransactionItems[0].txnType,
            transaction_type_detail:this.selectedTransactionTypeId === 'ALL' ? null : this.selectedTransactionTypeId,

        };
        this.eWalletTransactionHistoryService
            .getEWalletTransactionPDF(request, this.selectedOutlet)
            .subscribe((response: any) => {
                const file = new Blob([response], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
    }

    close() {
        this.modalService.dismissAll();
    }

    open(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        this.eWalletTransactionHistoryService
            .getDealerOwnerEmail(this.selectedOutlet)
            .subscribe((value: DealerOwnerResponse) => {
                this.emailTo = value.email;
            });

        this.eWalletService
            .getEwalletBalanceStatus(this.selectedOutlet)
            .subscribe((balanceStatus: BalanceStatus) => {
                if (balanceStatus) {
                    this.balanceStatusResponse = balanceStatus;
                }
            });
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

    changeType() {
        this.typeCount = 0;
        this.selectedTransactionTypeId = this.selectedTransactionType;
        this.internalPagination(0, 1);
    }

    changeOutlet() {
        this.getEWalletTransactionHistory(this.eWalletTransactionRequest);
    }

    pageChange(page: number) {
        const startFrom: number = (page - 1) * this.dataSize;
        this.internalPagination(startFrom, page);
    }
    pageChangeCashout(page: number) {
        this.getEwalletCashoutHistory(page - 1);
    }

    public savePDF(): void {
        this.toastService.show('Statement Exported', 'The statement is downloaded and emailed.');
    }

    loadOutlets() {
        const outletString = localStorage.getItem(StorageSettings.OUTLETS);
        if (outletString) {
            this.outletList = JSON.parse(outletString);
            this.selectedOutlets.push(this.outletList[0]);
            this.selectedOutlet = this.outletList[0].outlet_id;
            this.changeDetectorRef.detectChanges();
        }
    }

    loadStatus(){
        this.statusList.push('ALL');
        this.statusList.push('SUCCESS');
        this.statusList.push('FAILED');
        this.selectedStatusList = this.statusList;
    }

    internalPagination(startFrom: number, page: number) {
        this.page = page;
        this.dataFrom = startFrom + 1;
        this.dataTo = startFrom + this.dataSize;
        this.filteredTransactionItems = [];
        if (
            startFrom <
            this.eWalletTransactionHistoryData?.transaction_list_data.transaction_item.length
        ) {
            if (this.selectedTransactionTypeId === 'ALL') {
                this.filteredTransactionItems =
                    this.eWalletTransactionHistoryData?.transaction_list_data.transaction_item.slice(
                        startFrom,
                        this.dataTo
                    );
                this.typeCount =
                    this.eWalletTransactionHistoryData.transaction_list_data.transaction_item.length;
            } else {
                const txnList = [];
                for (
                    let i = 0;
                    i <
                    this.eWalletTransactionHistoryData?.transaction_list_data.transaction_item
                        .length;
                    i++
                ) {
                    if (
                        this.selectedTransactionTypeId ===
                        this.eWalletTransactionHistoryData.transaction_list_data.transaction_item[i]
                            .details
                    ) {
                        txnList.push(
                            this.eWalletTransactionHistoryData.transaction_list_data
                                .transaction_item[i]
                        );
                    } else if (
                        this.selectedTransactionType ===
                        this.eWalletTransactionHistoryData.transaction_list_data.transaction_item[i]
                            .details
                    ) {
                        txnList.push(
                            this.eWalletTransactionHistoryData.transaction_list_data
                                .transaction_item[i]
                        );
                    }
                }
                this.filteredTransactionItems = txnList.slice(startFrom, this.dataTo);
                this.typeCount = txnList.length;
            }
            this.dataTo = startFrom + this.filteredTransactionItems.length;
        } else {
            this.filteredTransactionItems = [];
            this.eWalletTransactionHistoryData.transaction_list_data.transaction_item = [];
            this.toastService.show('Data Not Found', 'Data not found this filters');
        }
        this.changeDetectorRef.detectChanges();
    }

    selectEmailRequired() {
        this.emailRequired = this.emailRequired != true;
    }

    onOutletChange() {
        if (this.selectedOutlets.length > 0) {
            this.outletsEmpty = false;
            this.requiredFieldEmpty = false;
            this.selectedOutlet = this.selectedOutlets[0].outlet_id;
            this.getEWalletTransactionHistory(this.eWalletTransactionRequest);
        } else {
            this.outletsEmpty = true;
            this.requiredFieldEmpty = true;
            this.filteredTransactionItems = [];
        }
    }

    onStatusChange() {
        this.selectedStatus = this.selectedStatusList[0];
        this.getEwalletCashoutHistory(0);
    }

    onTransactionChange() {
        if (this.selectedTransactionTypes.length > 0) {
            this.transactionTypesEmpty = false;
            this.requiredFieldEmpty = false;
            this.selectedTransactionType = this.selectedTransactionTypes[0];
            this.changeType();
        } else {
            this.transactionTypesEmpty = true;
            this.requiredFieldEmpty = true;
            this.filteredTransactionItems = [];
        }
    }

    onViewSummary(item:EWalletCashoutTransactionItem){
        this.showSummary.emit(true);
        this.setTransactionItem.emit(item);
    }

    getOwnerIdFromLoginUsersOutlet() {
        const outlets: any[] = this.localStorageService.getOutlets();
        if (outlets) {
            outlets.forEach(value => {
                if (value.owner_id) {
                    this.vendorId = value.owner_id;
                    return;
                }
            });
        }
    }
    getEwalletCashoutHistory(page:number){
        const sdate = new Date(this.selectedCashOutStartDate);
        const edate = new Date(this.selectedCashOutEndDate);
        this.eWalletTransactionHistoryService.getEwalletCashoutHistory(
            this.dealerRetrieve.partner_sap_id,
            this.formatDate(sdate),
            this.formatDate(edate),
            this.selectedStatus == 'ALL' ? '': this.selectedStatus, page).subscribe(
            response => {
                this.eWalletCashoutList = response.content;
                this.totalElements = response.totalElements;
                this.pageElements = response.numberOfElements
            }
          , (error) => {
            this.eWalletCashoutList = [];
            this.toastService.show(!error.error.errorMessage ? 'No results to display for the search made.' : 'Error', error.error.errorMessage || '');
        });
        this.changeDetectorRef.detectChanges();
    }
    onDownloadLink(): void {
        const sdate = new Date(this.selectedCashOutStartDate);
        const edate = new Date(this.selectedCashOutEndDate);
        this.eWalletTransactionHistoryService.downloadCashoutHistory(
            this.dealerRetrieve.partner_sap_id,
            this.formatDate(sdate),
            this.formatDate(edate),
            this.selectedStatus == 'ALL' ? '': this.selectedStatus).subscribe(response => {
            const file = new Blob([response], { type: 'data:application/vnd.ms-excel' });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = fileURL;
            a.download = `Cash out history (${ this.vendorId}).xls`;
            a.click();
            document.body.removeChild(a);
          }, (error) => {
            this.toastService.show('Unable to Download Excel File','');
          });
      }

     padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
      }

     formatDate(date: Date) {
        return (
          [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate()),
          ].join('-')
        );
      }

      getDealerRetrieve(){
        this.thresholdService.getThresholdDetails(
            (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id,
            this.localStorageService.get(StorageSettings.LOGIN_NAME)).subscribe((response) => {
                this.dealerRetrieve = response;
                this.getEwalletCashoutHistory(0);
            });
    }

}
