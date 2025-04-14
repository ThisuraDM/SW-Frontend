import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
    DealerStockTransferDetailsGetDetails
} from '@app/SW-layout/inventory/models/dealer-stock-transfer-details-get-details';
import {DealerTrackStockService} from '@app/SW-layout/inventory/services/dealer-track-stock.service';

@Component({
    selector: 'SW-dealer-stock-transfer-details-track-stock-movement',
    templateUrl: './dealer-stock-transfer-details-track-stock-movement.component.html',
    styleUrls: ['./dealer-stock-transfer-details-track-stock-movement.component.scss']
})
export class DealerStockTransferDetailsTrackStockMovementComponent implements OnInit {

    @Input() status = 'DO Issued';
    @Input() requestID = '';

    @Output() navigateBackToPreviousScreen = new EventEmitter();

    public stockTransferDetails?: DealerStockTransferDetailsGetDetails;

    constructor(
        private dealerTrackStockService: DealerTrackStockService,
    ) {
    }

    ngOnInit(): void {
        this.retrievePageLoadData();
    }

    onDownloadLink(type: 'Invoice' | 'Delivery_Order'): void {
        this.dealerTrackStockService.downloadInvoiceOrDeliveryOrderOld(this.requestID, type);
    }

    private retrievePageLoadData(): void {
        this.dealerTrackStockService.retrieveTransferDetails(this.requestID).subscribe(
            response => {
                this.stockTransferDetails = response;
            }
        );
    }

}
