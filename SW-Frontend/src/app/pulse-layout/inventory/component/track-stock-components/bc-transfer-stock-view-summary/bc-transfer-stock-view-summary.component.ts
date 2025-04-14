import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
    BCTrackStockSummaryPrintRequest,
    BcViewStockTransferDetailsBcToBc,
    StockTransferItemDetails
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import {BcViewStockService} from '@app/SW-layout/inventory/services/bc-view-stock.service';

@Component({
    selector: 'SW-bc-transfer-stock-view-summary',
    templateUrl: './bc-transfer-stock-view-summary.component.html',
    styleUrls: ['./bc-transfer-stock-view-summary.component.scss']
})
export class BcTransferStockViewSummaryComponent implements OnInit {

    @Input() requestId = '';

    @Output() doneClick = new EventEmitter<boolean>();

    public viewSummaryList = new Array<StockTransferItemDetails>();
    public stockTransferDetails?: BcViewStockTransferDetailsBcToBc;

    constructor(
        private bcViewStockService: BcViewStockService,
    ) {
    }

    ngOnInit(): void {
        this.getPageLoadData();
    }

    onPrintButtonClick(): void {
        const printRequest: BCTrackStockSummaryPrintRequest = {
            listOfItems: this.viewSummaryList.map(item => {
                return {
                    itemName: item.item_name,
                    transferQuantity: +item.transfer_quantity,
                    requestedQuantity: +item.requested_quantity,
                    sapMaterialCode: item.sap_material_code
                }
            }) ?? [],
            requestId: this.stockTransferDetails?.request_id ?? '',
            storeId: this.stockTransferDetails?.origin_outlet_store_id ?? '',
            storeName: this.stockTransferDetails?.origin_outlet_name ?? ''
        };
        this.bcViewStockService.printStockTransferDetails(printRequest);
    }

    onViewSummaryDoneClick(): void {
        this.doneClick.emit(true);
    }

    private getPageLoadData(): void {
        this.bcViewStockService.getStockTransferDetails(this.requestId).subscribe(res => {
            this.stockTransferDetails = res;
            this.viewSummaryList = res?.item_details || [];
        });
    }

}
