import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { BalanceStatus } from '@app/SW-layout/store/models/ewallet';
import { EwalletService } from '@app/SW-layout/store/services/ewallet.service';

import { StorageSettings } from '../../../../../constants/StorageSettings';

/**
 * SW e wallet balance status component
 * Author: Thisura Munasinghe
 * Created Date: 2021 Septmber 25
 */
@Component({
    selector: 'SW-e-wallet-balance-status',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './e-wallet-balance-status.component.html',
    styleUrls: ['e-wallet-balance-status.component.scss'],
})
export class EWalletBalanceStatusComponent implements OnInit, OnChanges {
    balanceStatusResponse!: BalanceStatus;
    selectedOutletId!: string;
    outletList: any[] = [];
    noData = false;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        private eWalletService: EwalletService,
    ) {
        this.selectedOutletId = '';
    }

    ngOnInit() {
        this.loadOutlets();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.outletChange();
    }

    /**
     * Gets ewallet balance status
     */
    getEwalletBalanceStatus() {
        this.eWalletService
            .getEwalletBalanceStatus(this.selectedOutletId)
            .subscribe((balanceStatus: BalanceStatus) => {
                if (balanceStatus) {
                    this.balanceStatusResponse = balanceStatus;
                    if (this.balanceStatusResponse.account_status != 'Active') {
                        this.balanceStatusResponse.account_holder_public_name = '-';
                        this.balanceStatusResponse.account_no = '-';
                        this.balanceStatusResponse.account_name = '-';
                        this.balanceStatusResponse.available_balance = '-';
                        this.balanceStatusResponse.account_status = balanceStatus.available_balance;
                        this.noData = true;
                    } else {
                        this.noData = false;
                    }
                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    /**
     * Outlets change
     */
    outletChange() {
        this.getEwalletBalanceStatus();
    }

    /**
     * Loads outlets
     */
    loadOutlets() {
        const outletString = localStorage.getItem(StorageSettings.OUTLETS);
        if (outletString != null) {
            this.outletList = JSON.parse(outletString);
            this.selectedOutletId = this.outletList[0].outlet_id;
            this.outletChange();
            this.changeDetectorRef.detectChanges();
        }
    }
}
