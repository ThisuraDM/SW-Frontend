import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DealerConfirmStockOrderDeliveryDetailsResponse } from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';
import {
    DealerStockTransferDetailsGetDetails,
    DealerStockTransferDetailsGetDetailsSummaryDetails,
} from '@app/SW-layout/inventory/models/dealer-stock-transfer-details-get-details';
import { DealerTrackStockService } from '@app/SW-layout/inventory/services/dealer-track-stock.service';
import { LocalStorageService } from '../../../../../../services/local-storage.service';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'SW-dealer-view-stock-order-summary',
    templateUrl: './dealer-view-stock-order-summary.component.html',
    styleUrls: ['./dealer-view-stock-order-summary.component.scss'],
})
export class DealerViewStockOrderSummaryComponent implements OnInit {

    @Input() requestId = '';
    @Input() confirmResponse?: DealerConfirmStockOrderDeliveryDetailsResponse;

    @Output() backClick = new EventEmitter<boolean>();

    public requestSummaryDetails?: DealerStockTransferDetailsGetDetails;
    public tableDataList = new Array<DealerStockTransferDetailsGetDetailsSummaryDetails>();

    public pageNumber = 1;

    constructor(
        private router: Router,
        private dealerTrackStockService: DealerTrackStockService,
        private localStorageService: LocalStorageService,
        private satisfactionSurveyService: SatisfactionSurveyService,
    ) {
    }

    ngOnInit(): void {
        this.getPageLoadData();
    }

    onCancelRequestClick(): void {
    }

    onRequestMoreClick(): void {
        this.router.navigateByUrl('/store/inventory', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/store/inventory/dealer-physical-stock-ordering']);
        });
    }

    onTrackClick(): void {
        this.router.navigate([
            '/store/inventory/dealer-track-stock-transfer',
            this.requestId,
            this.confirmResponse?.stock_order_status,
        ]);
    }

    private getPageLoadData(): void {
        this.dealerTrackStockService.retrieveTransferDetails(this.requestId).subscribe(
            response => {
                this.requestSummaryDetails = response;
                this.tableDataList = response?.summary_details || [];
                this.satisfactionSurveyService.show('PHYSICAL_STOCK_ORDERING')
            });
    }
}
