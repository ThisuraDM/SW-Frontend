import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Outlets} from '@app/SW-layout/dashboard/models/region-outlets';
import {
    BcViewStockTransferDetailsBcToBc,
    StockTransferItemDetails
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import {BcViewStockService} from '@app/SW-layout/inventory/services/bc-view-stock.service';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {LocalStorageService} from 'services/local-storage.service';

@Component({
  selector: 'SW-bc-view-stock-transfer-details-wh-to-bc',
  templateUrl: './bc-view-stock-transfer-details-wh-to-bc.component.html',
  styleUrls: ['./bc-view-stock-transfer-details-wh-to-bc.component.scss']
})
export class BcViewStockTransferDetailsWhToBcComponent implements OnInit {

    @Input() status = '';
    @Input() requestId = '';
    @Output() backClick = new EventEmitter<boolean>();
    @Output() startAcknowledgeClick = new EventEmitter<boolean>();

    public displayedScreen: 'main' | 'stock-transfer' = 'main';
    public userType: 'origin-user' | 'destination-user' = 'origin-user';

    public stockTransferDetails?: BcViewStockTransferDetailsBcToBc;
    public tableDataList = new Array<StockTransferItemDetails>();

    public historicalDataModalRef?: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private bcViewStockService: BcViewStockService,
        private localStorageService: LocalStorageService,
    ) {
    }

    ngOnInit(): void {
        this.getPageLoadData();
    }

    onPendingRequestClick(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}): void {
        this.historicalDataModalRef = this.modalService.open(content, modalOptions);
    }

    onStockMovementClick(): void {
    }

    onCancelRequestClick(): void {
    }

    onGetTotalClick(): void {
    }

    private getPageLoadData(): void {
        this.bcViewStockService.getStockTransferDetails(this.requestId).subscribe(res => {
            this.stockTransferDetails = res;
            this.tableDataList = res?.item_details || [];
            this.status = res?.status;
            const loggedInOutletId = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id;
            if (loggedInOutletId === this.stockTransferDetails?.origin_outlet_store_id) {
                this.userType = 'origin-user';
            } else if (loggedInOutletId === this.stockTransferDetails?.destination_outlet_store_id) {
                this.userType = 'destination-user';
            }
        });
    }

}
