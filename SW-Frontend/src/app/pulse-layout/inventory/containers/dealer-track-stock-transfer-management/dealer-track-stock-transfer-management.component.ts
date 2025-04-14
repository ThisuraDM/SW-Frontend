import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealerSearchToTrackStockTransferComponent } from '@app/SW-layout/inventory/component/track-stock-components/dealer-search-to-track-stock-transfer/dealer-search-to-track-stock-transfer.component';
import { Content } from '@app/SW-layout/inventory/models/dealer-stock-transfer-details';
import { NavigationOptions } from '@app/SW-layout/inventory/models/trasfer-details';
import { RcspStockDetails } from '../../models/dealer-track-stock';

@Component({
  selector: 'SW-dealer-track-stock-transfer-management',
  templateUrl: './dealer-track-stock-transfer-management.component.html'
})
export class DealerTrackStockTransferManagementComponent implements OnInit {

    @ViewChild(DealerSearchToTrackStockTransferComponent) searchTrackStockTransferComponent?: DealerSearchToTrackStockTransferComponent;

  public displayScreen: NavigationOptions = NavigationOptions.SEARCH;
  public displayScreenRcspDetails = false;
  selectedRow?: Content;
  public selectedRowRcsp:RcspStockDetails = {
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
  };
  selectedOutlet = '';

  constructor(
      private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
      if (this.activatedRoute.snapshot.params.requestId) {
          setTimeout(() => {
              this.searchTrackStockTransferComponent?.onSelectAction({
                  stockRequestStatus: this.activatedRoute.snapshot.params.requestStatus,
                  action: '',
                  stockRequestId: this.activatedRoute.snapshot.params.requestId,
                  payType: '',
                  paymentTermId: '',
                  lastUpdatedDate: '',
                  salesOrderNo: '',
                  dateCreated: '',
                  navigateOption: NavigationOptions.VIEW_DETAILS,
                  requestStoreId: '',
                  stockOrderRequestId: this.activatedRoute.snapshot.params.stockOrderRequestId
              }, '');
          }, 0);
      }
  }

  onSelectTransferRequest(event: Content) {
    if (event.navigateOption === 'N/A') {
        return;
    }
    // this.isBCToBC = true;
    this.selectedRow = event;
    this.displayScreen = event.navigateOption;
    }
    onSelectTransferRequestRcsp(event: RcspStockDetails){
        this.displayScreenRcspDetails = true;
        this.displayScreen = NavigationOptions.RCSP_TRACK_STOCK_DETAILS;
        this.selectedRowRcsp = event
    }

    onSelectTransferRequestOutlet(outlet:string){
    this.selectedOutlet = outlet;
    }

    onBackClick(navigateOption:NavigationOptions): void {
        console.log(navigateOption);
        this.displayScreen = navigateOption;
        this.displayScreenRcspDetails = false;
    }

    onTrackStockTransferViewMoreClick(): void {
      this.displayScreen = NavigationOptions.VIEW_STOCK_MOVEMENT;
    }

    onStartAcknowledgeClick(): void {
        this.displayScreen = NavigationOptions.START_ACKNOWLEDGE;
    }

    public setHeadingBarInputData(): { title: string, screenToNavigate: NavigationOptions } {
        let headingInputData = {title: 'Stock Transfer Details', screenToNavigate: NavigationOptions.SEARCH};
        switch (this.displayScreen) {
            case NavigationOptions.ACKNOWLEDGE:
            case NavigationOptions.VIEW_DETAILS:
            case NavigationOptions.APPROVE_REJECT:
                headingInputData = {title: 'Stock Transfer Details', screenToNavigate: NavigationOptions.SEARCH};
                break;
            case NavigationOptions.VIEW_STOCK_MOVEMENT:
                headingInputData = {
                    title: 'Stock Transfer Details - Track Stock Movement',
                    screenToNavigate: this.selectedRow?.navigateOption as NavigationOptions
                };
                break;
            case NavigationOptions.START_ACKNOWLEDGE:
                headingInputData = {
                    title: 'Acknowledge Stock Transfer',
                    screenToNavigate: this.selectedRow?.navigateOption as NavigationOptions
                };
                break;
            case NavigationOptions.ACKNOWLEDGE_TRANSFER_STOCK_SUMMARY:
                headingInputData = {title: 'Acknowledge Stock Transfer Summary', screenToNavigate: NavigationOptions.START_ACKNOWLEDGE};
                break;
            case NavigationOptions.RCSP_TRACK_STOCK_DETAILS:
                headingInputData = {title: 'Track Stock Details', screenToNavigate: NavigationOptions.RCSP_TRACK_STOCK_DETAILS};
        }
        return headingInputData;
    }

}
