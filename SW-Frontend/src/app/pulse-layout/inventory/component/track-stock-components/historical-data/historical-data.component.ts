import {Component, Input, OnInit} from '@angular/core';
import {
    BcViewStockTransferDetailsBcToBc
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import {
    DealerStockTransferDetailsGetDetails
} from '@app/SW-layout/inventory/models/dealer-stock-transfer-details-get-details';

@Component({
    selector: 'SW-historical-data',
    templateUrl: './historical-data.component.html',
    styleUrls: ['./historical-data.component.scss']
})
export class HistoricalDataComponent implements OnInit {

    @Input() isBlueCubeUser = true;
    @Input() stockTransferDetails?: BcViewStockTransferDetailsBcToBc;
    @Input() dealerStockTransferDetails?: DealerStockTransferDetailsGetDetails;

    constructor() {
    }

    ngOnInit(): void {
    }

}
