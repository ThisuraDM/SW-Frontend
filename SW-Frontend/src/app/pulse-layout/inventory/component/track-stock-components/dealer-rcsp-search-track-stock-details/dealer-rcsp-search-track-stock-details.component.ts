import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import {
    DealerStockTransferDetailsGetDetails,
    DealerStockTransferDetailsGetDetailsSummaryDetails,
} from '@app/SW-layout/inventory/models/dealer-stock-transfer-details-get-details';
import {
    DealerStockTransferAcceptRejectRequest,
    RcspStockDetails,
} from '@app/SW-layout/inventory/models/dealer-track-stock';
import { DealerTrackStockService } from '@app/SW-layout/inventory/services/dealer-track-stock.service';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StorageSettings } from 'constants/StorageSettings';
import { LocalStorageService } from 'services/local-storage.service';
import { NavigationOptions } from '@app/SW-layout/inventory/models/trasfer-details';

@Component({
  selector: 'SW-dealer-rcsp-search-track-stock-details',
  templateUrl: './dealer-rcsp-search-track-stock-details.component.html',
  styleUrls: ['./dealer-rcsp-search-track-stock-details.component.scss']
})
export class DealerRcspSearchTrackStockDetailsComponent implements OnInit {

  @Input() status = '';
  @Input() requestID = '';
  @Input() salesOrderID = '';
  @Input() outletID = '';
  @Input() selectedRowRcsp: RcspStockDetails = {
    orderId: '',
    orderNumber: '',
    orderStatus: '',
    outletId: '',
    outletName: '',
    orderDate: '',
    expectedDeliveryDate: '',
    branchName: '',
    storeName: '',
    employeeCode: '',
    employeeName: '',
    orderAmount: 0,
    paymentType: '',
    invoiceNumber:'',
    items: []
  }

  @Output() backClick = new EventEmitter<NavigationOptions>();
  @Output() viewMoreClick = new EventEmitter<boolean>();
  @Output() startAcknowledgeClick = new EventEmitter<boolean>();

  public stockTransferDetails?: DealerStockTransferDetailsGetDetails;
  public tableDataList = new Array<DealerStockTransferDetailsGetDetailsSummaryDetails>();
  public statusUppercase = '';
  public isInvoiceDisable = true;
  public isDODisable = true;
  public acceptRejectModalRef?: NgbModalRef;
  public historicalDataModalRef?: NgbModalRef;
  public isCancelled = false;

  constructor(
    private toastService: ToastService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private dealerTrackStockService: DealerTrackStockService,
  ) {
  }

  ngOnInit(): void {
    this.statusUppercase = this.selectedRowRcsp.orderStatus.toUpperCase();
    if(this.statusUppercase == 'CANCELLED' ){
      this.isCancelled = true;
    }
    this.checkDisable();
    this.retrievePageLoadData();
  }

  checkDisable() {
    if (this.statusUppercase == 'DELIVERED') {
      this.isInvoiceDisable = false;
    }else{
      this.isInvoiceDisable = true;
    }
  }

  onCurrentStatusClick(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}): void {
    this.historicalDataModalRef = this.modalService.open(content, modalOptions);
  }

  onDownloadLink(): void {
    this.dealerTrackStockService.downloadInvoiceOrDeliveryOrderRcsp(
      this.selectedRowRcsp.outletId, this.selectedRowRcsp.orderNumber).subscribe(response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = fileURL;
        a.download = `Invoice (${this.selectedRowRcsp.orderNumber}).pdf`;
        a.click();
        document.body.removeChild(a);

      }, (error) => {
        this.toastService.show('Unable to Download Invoice','');
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
          this.backClick.emit(NavigationOptions.RCSP_TRACK_STOCK_DETAILS);
        }
      }
    );
  }

  onAcceptRejectClick(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}): void {
    this.acceptRejectModalRef = this.modalService.open(content, modalOptions);
  }

  onGetTotalClick(): void {
  }

  onPopupAcceptRejectClick(acceptOrReject: 'R' | 'C'): void {
    if (acceptOrReject == "C") {
      this.dealerTrackStockService.cancelRcspStocks(this.selectedRowRcsp.outletId, this.selectedRowRcsp.orderNumber).subscribe(
        response => {
          this.acceptRejectModalRef?.close();
          this.isCancelled = true;
        }, err => {
          console.log(err);
          this.toastService.show('Error', err.error.errorMessage);
        });
    } else {
      this.acceptRejectModalRef?.close();
    }
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

  onBackClick() {
    this.backClick.emit(NavigationOptions.SEARCH);
  }
}
