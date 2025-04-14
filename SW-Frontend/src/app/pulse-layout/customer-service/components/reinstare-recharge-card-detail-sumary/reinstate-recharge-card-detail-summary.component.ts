import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnlockResponse } from '@app/SW-layout/customer-service/models/voucher-info';
import { ReinstateRechargeCardService } from '@app/SW-layout/customer-service/services/reinstate-recharge-card.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { ToastService } from '@common/services';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import { StorageSettings } from '../../../../../constants/StorageSettings';

@Component({
    selector: 'SW-reinstate-recharge-card-detail-summary',
    templateUrl: './reinstate-recharge-card-detail-summary.component.html',
    styleUrls: ['./reinstate-recharge-card-detail-summary.component.scss'],
})
export class ReinstateRechargeCardDetailSummaryComponent implements OnInit {

    @Input() viewData!: UnlockResponse;
    @Input() backToListButton: boolean= false;
    @Output() backClick = new EventEmitter<boolean>();
    @Output() backToListClick = new EventEmitter<boolean>();

    outletId: string;
    userId: string;

    constructor(private reinstateRechargeCardService: ReinstateRechargeCardService,
                 private localStorageService: LocalStorageService,
                 private toastService: ToastService,
    ) {
        this.outletId = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
        this.userId = this.localStorageService.get(StorageSettings.LOGIN_NAME);
    }

    ngOnInit(): void {
    }

    onClickBack() {
        this.backClick.emit(false);
    }

    onClickBackToList() {
        this.backToListClick.emit(false);
    }

    printDetails() {
        this.reinstateRechargeCardService.unlockSummaryDetailDownload(this.outletId, this.viewData.transactionId, this.viewData.serialNo, this.viewData.id, this.userId)
            .subscribe(response => {
                const file = new Blob([response.body as BlobPart], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = 'Unlock Summary.pdf';
                a.click();
            }, err => {
                this.toastService.show('Unable to get print data', '');
            });
    }
}
