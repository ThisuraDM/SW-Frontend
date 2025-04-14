import { Component, OnInit, TemplateRef } from '@angular/core';
import {
    TransactionHistory,
    TransactionHistoryRequest,
    TransactionHistoryResponse,
} from '@app/SW-layout/store/models/receipt-reprint/transaction-history';
import { ReceiptReprintService } from '@app/SW-layout/store/services/receipt-reprint/receipt-reprint.service';
import { TransactionTypes } from '@app/SW-layout/store/models/receipt-reprint/transaction-types';
import { combineLatest, Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DateRangeService, ToastService } from '@common/services';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { StorageSettings } from '../../../../../constants/StorageSettings';

@Component({
    selector: 'SW-receipt-reprint-management',
    templateUrl: './receipt-reprint-management.component.html',
    styleUrls: ['./receipt-reprint-management.component.scss'],
})
export class ReceiptReprintManagementComponent implements OnInit {
    public title = 'Receipt Reprint';
    public pageNo = 0;
    public pageSize = 10;
    public searchBy: string = 'Search By';
    transactionHistory: TransactionHistory[] = [];
    transactionHistoryResponse!: TransactionHistoryResponse;
    transactionHistoryRequest!: TransactionHistoryRequest;
    transactionList: TransactionTypes[] = [];
    transactionSettings!: IDropdownSettings;
    selectedTransactionTypes: any[] = [];
    subscription: Subscription = new Subscription();
    successEmailSend: boolean = true;
    emailDetails: {
        receipt_id: number,
        transaction_type: string,
        emailAddress: string
    };
    errorMessage: string = 'Unable to retrieve information';
    dataLoadingError: boolean = true;
    startDate!: Date;
    endDate!: Date;
    selectedRange!: string;
    isFirst: boolean = true;
    isBc: boolean = false;
    loginName: string = '';

    constructor(public dateRangeService: DateRangeService,
                private receiptReprintService: ReceiptReprintService,
                private modalService: NgbModal,
                private localStorageService: LocalStorageService,
                private toastService: ToastService) {
        this.transactionHistoryRequest = {
            end_date_time: '',
            search_by: 'Search By',
            search_value: '',
            start_date_time: '',
            transaction_type_id: 0,
        };
        // this.transactionHistoryRequest = {
        //     end_date_time: '20211224133200',
        //     search_by: 'NAME',
        //     search_value: 'DOUBLE E.SHOP',
        //     start_date_time: '20210101133200',
        //     transaction_type_id: 0,
        // };
        this.transactionSettings = {
            singleSelection: true,
            enableCheckAll: false,
            idField: 'id',
            textField: 'transaction_type_name',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };
        this.emailDetails = {
            receipt_id: 0,
            transaction_type: '',
            emailAddress: '',
        };
    }

    ngOnInit(): void {
        this.loginName = this.localStorageService.get('login-name');
        this.checkIsBcUser();
        this.getTransactionType();
        this.dateRangeService.setRange('THIS_MONTH');

        this.subscription.add(
            combineLatest([
                this.dateRangeService.selectedDateObject$,
                this.dateRangeService.selectedRange$,
            ]).subscribe(([dateObject, dateRange]) => {
                if (dateObject.startDate !== dateObject.endDate) {
                    this.startDate = dateObject.startDate;
                    this.endDate = dateObject.endDate;
                    this.transactionHistoryRequest.start_date_time = this.setDate(dateObject.startDate);
                    this.transactionHistoryRequest.end_date_time = this.setDate(dateObject.endDate);
                }
                this.selectedRange = dateRange;
                this.searchTransactionHistory(0);
            }),
        );
        this.transactionList.unshift({
            id: 0,
            transaction_type_name: 'ALL',
        });
        this.selectedTransactionTypes.push(this.transactionList[0]);
        // this.searchTransactionHistory();
    }

    getTransactionType() {
        this.receiptReprintService.getTransactionTypes()
            .subscribe(value => {
                this.transactionList = value.sort((a, b) => a.transaction_type_name.localeCompare(b.transaction_type_name));
            });
    }

    selectSearchBy(searchByValue: string, searchBy: string) {
        this.searchBy = searchBy;
        this.transactionHistoryRequest.search_by = searchByValue;
    }

    setDate(value: Date) {
        const month = '' + (new Date(value).getMonth() + 1);
        const year = new Date(value).getFullYear();
        const day = '' + new Date(value).getDate();

        const modeMonth = month.length === 1 ? '0' + month : '' + month;
        const modeDay = day.length === 1 ? '0' + day : '' + day;

        return year + modeMonth + modeDay + '000000';
    }

    onTransactionChange() {
        if (this.selectedTransactionTypes.length > 0) {
            this.transactionHistoryRequest.transaction_type_id = this.selectedTransactionTypes[0].id;
        } else {
            this.selectedTransactionTypes = [{
                id: 0,
                transaction_type_name: 'ALL',
            }];
            this.transactionHistoryRequest.transaction_type_id = 0;
        }
        this.searchTransactionHistory(0);
    }

    searchTransactionHistory(page?: number) {
        if (page != null) {
            this.pageNo = page;
        }

        if (this.selectedRange == 'CUSTOM' && !this.checkMaxDateRangeSelectionWithinThirtyDays()) {
            if (!this.isFirst) {
                this.toastService.show('Invalid Date Range', 'Maximum date range selection is 30 days');
                return;
            } else {
                this.isFirst = false;
            }
        }

        this.receiptReprintService.searchTransactionHistory(this.transactionHistoryRequest, this.pageSize, this.pageNo, this.isBc, this.loginName)
            .subscribe(value => {
                if (value.content) {
                    this.dataLoadingError = false;
                    this.transactionHistoryResponse = value;
                    this.transactionHistory = this.transactionHistoryResponse.content;
                    if (this.transactionHistory.length <= 0) {
                        this.errorMessage = 'No transactions found';
                        this.dataLoadingError = true;
                    }
                } else {
                    this.errorMessage = 'Unable to retrieve information';
                    this.dataLoadingError = true;
                }
            });
    }

    private checkMaxDateRangeSelectionWithinThirtyDays() {
        let diff = Math.abs(this.startDate.getTime() - this.endDate.getTime());
        let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        if (diffDays <= 30) {
            return true;
        }
        return false;
    }

    downloadReceipt(receipt_id: number, transaction_type: string) {
        this.receiptReprintService.receiptDownload(receipt_id, transaction_type, this.localStorageService.get(StorageSettings.LOGIN_NAME))
            .subscribe(response => {
                const file = new Blob([response], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = receipt_id + '-' + transaction_type;
                a.click();
                document.body.removeChild(a);
                this.toastService.show('Statement Exported', 'The receipt is downloaded.');
            });
    }

    printReceipt(receipt_id: number, transaction_type: string) {
        this.receiptReprintService.receiptReprint(receipt_id, transaction_type, this.localStorageService.get(StorageSettings.LOGIN_NAME))
            .subscribe(response => {
                const file = new Blob([response], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
    }

    emailReceipt(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}, receipt_id: number, transaction_type: string) {
        this.emailDetails.receipt_id = receipt_id;
        this.emailDetails.transaction_type = transaction_type;
        this.modalService.open(content, modalOptions).result.then(
            (result) => {
                console.log(`Closed with: ${result}`);
            },
            (reason) => {
                console.log(`Dismissed ${this._getDismissReason(reason)}`);
            },
        );
    }

    confirm() {
        this.receiptReprintService.receiptEmail(this.emailDetails.receipt_id, this.emailDetails.transaction_type, this.emailDetails.emailAddress)
            .subscribe(response => {
                if (response.responseCode == 200) {
                    this.successEmailSend = true;
                } else {
                    this.successEmailSend = false;
                }
            });
    }

    open(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}) {
        this.modalService.open(content, modalOptions).result.then(
            (result) => {
                console.log(`Closed with: ${result}`);
            },
            (reason) => {
                console.log(`Dismissed ${this._getDismissReason(reason)}`);
            },
        );
    }

    loadPage(page: number) {
        this.pageNo = page - 1;
        this.searchTransactionHistory();
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

    private checkIsBcUser() {
        const permissions: [] = this.localStorageService.getPermissions();
        permissions.forEach(value => {
            if (value === 'RECEIPT_REPRINT_BC') {
                this.isBc = true;
                return;
            }
        });
    }
}
