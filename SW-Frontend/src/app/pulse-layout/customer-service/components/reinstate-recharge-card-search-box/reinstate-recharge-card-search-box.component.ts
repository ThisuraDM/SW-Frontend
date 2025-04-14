import { Component, OnInit } from '@angular/core';
import { ReinstateRechargeCardService } from '@app/SW-layout/customer-service/services/reinstate-recharge-card.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { StorageSettings } from '../../../../../constants/StorageSettings';
import {
    HistoryDetail,
    UnlockRequest,
    UnlockResponse,
    VoucherInfoDetails,
} from '@app/SW-layout/customer-service/models/voucher-info';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import { ToastService } from '@common/services';
import { Paginate } from '../../../../../models/paginate';

const tableProperties = {
    limit: 10,
    pageNum: 0,
    page: 0,
    sortBy: 'sales',
    pageSize: 4,
};

@Component({
    selector: 'SW-reinstate-recharge-card-search-box',
    templateUrl: './reinstate-recharge-card-search-box.component.html',
    styleUrls: ['./reinstate-recharge-card-search-box.component.scss'],
})
export class ReinstateRechargeCardSearchBoxComponent implements OnInit {
    public dateRages = [
        { value: 'Today', id: 0 },
        { value: 'Yesterday', id: 1 },
        { value: 'Last 7 days', id: 7 },
        { value: 'Last 14 days', id: 14 },
        { value: 'Last 30 days', id: 30 },
        { value: 'Last 60 days', id: 60 },
        { value: 'Last 90 days', id: 90 },
    ];

    voucherInfo!: VoucherInfoDetails;
    unlockRequest: UnlockRequest = {
        startSerialNo: '',
        operationReason: '',
    };
    remark: string = '';
    reasonList: string[] = [];
    navItemClick: string = 'Unlock';
    outletId: string;
    userId: string;
    unlockResponse!: UnlockResponse;
    backToListButton: boolean= false
    selectedIndex: number = 0;
    invalidSerialNo: boolean = false;
    invalidSerialNoError: string = '';
    unlockRechargeCardHistory!: Paginate<HistoryDetail>;
    showSummary: boolean = false;

    pageNum!: number;
    pageSize!: number;
    sortBy!: string;

    fromDate!: string;
    toDate!: string;

    serialNo: any;
    dateRange: any = 7;
    public today: any = new Date();

    constructor(private reinstateRechargeCardService: ReinstateRechargeCardService,
                private localStorageService: LocalStorageService,
                private toastService: ToastService,
    ) {
        this.outletId = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
        this.userId = this.localStorageService.get(StorageSettings.LOGIN_NAME);

        this.pageNum = tableProperties.pageNum;
        this.sortBy = tableProperties.sortBy;
        this.pageSize = tableProperties.pageSize;
    }

    ngOnInit(): void {
        this.reinstateRechargeCardService.getUserReinstateCardUnlockReasons()
            .subscribe(value => {
                this.reasonList = value;
            });
        this.unLockRechargeCardHistory();
    }

    searchBySerial() {
        if (!this.serialNo) {
            this.invalidSerialNo = true;
            this.invalidSerialNoError = 'Invalid serial number';
            return;
        }
        if (this.navItemClick == 'Unlock') {
            this.invalidSerialNo = false;
            this.reinstateRechargeCardService.getUserReinstateCardDetails(this.outletId, this.serialNo, this.userId)
                .subscribe(value => {
                    this.voucherInfo = value.voucherInfo;
                }, error => {
                    this.invalidSerialNo = true;
                    this.invalidSerialNoError = error.error.errorMessage;
                    if (error.error.fault.code === 900908) {
                        this.toastService.show('Error', 'Unable to get data. Please retry');
                    }
                });
        } else {
            this.invalidSerialNo = false;
            this.unLockRechargeCardHistory();
        }
    }

    unLockRechargeCardHistory() {
        this.pageNum = 0;
        let serial = '';
        if (this.serialNo != null) {
            serial = this.serialNo;
        }
        this.getSelectedDateRange();
        this.reinstateRechargeCardService.getUnLockRechargeCardHistory(this.outletId, serial, this.fromDate, this.toDate, this.pageNum, tableProperties.limit, this.userId)
            .subscribe(value => {
                this.unlockRechargeCardHistory = value;
            });
    }

    getSelectedDateRange() {
        this.toDate = this.formatDate(`${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate()}`, true);
        this.fromDate = this.formatDate(this.dateRange, false);
    }

    formatDate(dateRange: any, isToDate: boolean) {
        let month;
        let day;
        let year;
        let chars;
        let noneFormatDate;
        if (!isToDate) {
            let days = dateRange;
            let date = new Date();
            let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
            noneFormatDate = `${last.getFullYear()}-${last.getMonth() + 1}-${last.getDate()}`;

            chars = noneFormatDate.split('-');
            day = last.getDate() + '';
            month = last.getMonth() + 1 + '';
            year = last.getFullYear();
        } else {
            noneFormatDate = dateRange;
            chars = noneFormatDate.split('-');
            day = chars[2] + '';
            month = chars[1] + '';
            year = chars[0] + '';
        }
        if (chars[1].length === 1) {
            month = '0' + chars[1];
        }
        if (chars[2].length === 1) {
            day = '0' + chars[2];
        }
        return year + '-' + month + '-' + day;
    }

    unLockRechargeCard() {
        if (this.voucherInfo.hotCardFlag === 4) {
            this.unlockRequest.startSerialNo = this.voucherInfo.serialNo;
            if (this.unlockRequest.operationReason == 'Others') {
                this.unlockRequest.operationReason = this.remark;
            }
            this.reinstateRechargeCardService.unlockRechargeCard(this.outletId, this.unlockRequest, this.userId)
                .subscribe(value => {
                    this.viewSummary(value.transactionId, value.id, false)
                }, error => {
                    this.toastService.show('Unable to unlock', 'Unlock was not successful, please try again.');
                });
        } else {
            this.toastService.show('Unable to unlock', 'Unlock was not successful, Status should be Locked.');
        }
    }

    getNavItemClick(index: any) {
        this.navItemClick = index;
    }

    viewSummary(transactionId: string, id: number, backToList: boolean) {
        this.backToListButton = backToList;
        this.reinstateRechargeCardService.getRechargeCardUnlockSummary(this.outletId, transactionId, id ,this.userId)
            .subscribe(value => {
                this.showSummary = true;
                this.unlockResponse = {
                    id: value.id,
                    denomination: value.denomination,
                    operationReason: value.operationReason,
                    rechargeCardExpDate: value.rechargeCardExpDate,
                    rechargeCardStatus: value.rechargeCardStatus,
                    serialNo: value.serialNo,
                    transactionId: value.transactionId,
                    transactionStatus: value.transactionStatus,
                };
            });
    }

    backClick() {
        this.showSummary = false
        this.serialNo = '';
        this.unlockRechargeCardHistory.content = [];
    }

    backToListClick() {
        this.selectedIndex = 1;
        this.navItemClick = "View History"
        this.showSummary = false
        this.serialNo = '';
    }
}
