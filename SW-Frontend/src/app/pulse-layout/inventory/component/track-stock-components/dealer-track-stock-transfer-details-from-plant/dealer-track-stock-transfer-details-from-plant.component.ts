import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { DealerStockTransferAcceptRejectRequest } from '@app/SW-layout/inventory/models/dealer-track-stock';
import { DealerTrackStockService } from '@app/SW-layout/inventory/services/dealer-track-stock.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { StorageSettings } from 'constants/StorageSettings';
import { LocalStorageService } from 'services/local-storage.service';
import {
    DealerStockTransferDetailsGetDetails,
    DealerStockTransferDetailsGetDetailsSummaryDetails,
} from '@app/SW-layout/inventory/models/dealer-stock-transfer-details-get-details';
import { ToastService } from '@common/services';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'SW-dealer-track-stock-transfer-details-from-plant',
    templateUrl: './dealer-track-stock-transfer-details-from-plant.component.html',
    styleUrls: ['./dealer-track-stock-transfer-details-from-plant.component.scss']
})
export class DealerTrackStockTransferDetailsFromPlantComponent implements OnInit {

    @Input() status = '';
    @Input() requestID = '';
    @Input() salesOrderID = '';
    @Input() outletID = '';

    @Output() backClick = new EventEmitter<boolean>();
    @Output() viewMoreClick = new EventEmitter<boolean>();
    @Output() startAcknowledgeClick = new EventEmitter<boolean>();

    public stockTransferDetails?: DealerStockTransferDetailsGetDetails;
    public tableDataList = new Array<DealerStockTransferDetailsGetDetailsSummaryDetails>();
    public statusUppercase = '';
    public isInvoiceDisable = true;
    public isDODisable = true;
    public acceptRejectModalRef?: NgbModalRef;
    public historicalDataModalRef?: NgbModalRef;

    constructor(
        private toastService: ToastService,
        private modalService: NgbModal,
        private localStorageService: LocalStorageService,
        private dealerTrackStockService: DealerTrackStockService,
        private satisfactionSurveyService: SatisfactionSurveyService,
    ) {
    }

    ngOnInit(): void {
        this.statusUppercase = this.status.toUpperCase();
        this.checkDisable();
        this.retrievePageLoadData();
        this.satisfactionSurveyService.show("TRACK_STOCK")
    }

    checkDisable(){
        if (this.statusUppercase == 'SO ACCEPTED' || this.statusUppercase == 'PAYMENT IN PROGRESS' ||
        this.statusUppercase == 'PAYMENT COMPLETED' ||this.statusUppercase == 'DO ISSUED' ||
        this.statusUppercase == 'DO FULFILLED') {
            this.isInvoiceDisable = false;
        }
        if (this.statusUppercase == 'DO ISSUED' || this.statusUppercase == 'DO FULFILLED') {
            this.isDODisable = false;
        }
    }

    onCurrentStatusClick(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}): void {
        this.historicalDataModalRef = this.modalService.open(content, modalOptions);
    }

    onDownloadLink(type: 'SALES_INVOICE' | 'DELIVERY_ORDER'): void {
        this.dealerTrackStockService.downloadInvoiceOrDeliveryOrder(
            this.outletID,this.salesOrderID, type).subscribe(response => {
            const file = new Blob([response], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = fileURL;
            a.download = `Sales Order (${type}).pdf`;
            a.click();
            document.body.removeChild(a);

        }, (error) => {
            this.toastService.show( type == 'SALES_INVOICE'?'Unable to Download Sales Invoice':'Unable to Download Delivery Order' ,'');
        });
    }

    onCancelRequestClick(): void {
        const acceptRejectRequest: DealerStockTransferAcceptRejectRequest = {
            action: 'C',
            approval_user: this.localStorageService.get(StorageSettings.LOGIN_NAME),
            stock_request_id: this.requestID
        };
        this.dealerTrackStockService.acceptOrRejectTransfer(acceptRejectRequest).subscribe(
            response => {
                if (response) {
                    this.backClick.emit(true);
                }
            }
        );
    }

    onAcceptRejectClick(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}): void {
        this.acceptRejectModalRef = this.modalService.open(content, modalOptions);
    }

    onGetTotalClick(): void {
    }

    onPopupAcceptRejectClick(acceptOrReject: 'A' | 'C'): void {
        const acceptRejectRequest: DealerStockTransferAcceptRejectRequest = {
            action: acceptOrReject,
            approval_user: this.localStorageService.get(StorageSettings.LOGIN_NAME),
            stock_request_id: this.requestID
        };
        this.dealerTrackStockService.acceptOrRejectTransfer(acceptRejectRequest).subscribe(
            response => {
                if (response) {
                    this.acceptRejectModalRef?.close();
                    this.retrievePageLoadData();
                }
            }
        );
    }

    private retrievePageLoadData(): void {
        this.dealerTrackStockService.retrieveTransferDetails(this.requestID).subscribe(
            response => {
                this.stockTransferDetails = response;
                this.status = response.status;
                this.statusUppercase = this.status.toUpperCase();
                this.tableDataList = response?.summary_details ?? [];
            }
        );
    }
}
