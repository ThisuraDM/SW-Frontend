import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BcSearchAndViewStockTransferRequestsBcBcComponent } from '@app/SW-layout/inventory/component/track-stock-components/bc-search-and-view-stock-transfer-requests-bc-bc/bc-search-and-view-stock-transfer-requests-bc-bc.component';
import { StockTransferItemDetails } from '../../models/bc-view-stock-transfer-details-bc-to-bc';

import { Content, NavigationOptions } from '../../models/trasfer-details';


@Component({
  selector: 'SW-dealer-stock-acknowledge-management',
  templateUrl: './dealer-stock-acknowledge-management.component.html',
  styleUrls: ['./dealer-stock-acknowledge-management.component.scss']
})
export class DealerStockAcknowledgeManagementComponent implements OnInit {

  @ViewChild(BcSearchAndViewStockTransferRequestsBcBcComponent) searchTransferRequestComponent?:
  BcSearchAndViewStockTransferRequestsBcBcComponent;

public displayScreen: NavigationOptions = NavigationOptions.SEARCH;
public selectedRow?: Content;
public itemRow:StockTransferItemDetails = {
  approved_quantity: '',
  brand: '',
  category: '',
  description: '',
  item_name: '',
  received_quantity: '',
  requested_quantity: '',
  available_quantity: '',
  reserved_quantity: '',
  sap_material_code: '',
  serial_numbers: [],
  transfer_quantity: '',
  added_serial_numbers: [],
  isVerified: false,
  serial_number: ''
}
public isBCToBC = true;
public summaryRequestId = '';
public transferSummaryNavigatedFrom: 'START_APPROVE_REJECT_SUMMARY' | 'MAIN' = 'MAIN';

constructor(
  private activatedRoute: ActivatedRoute
) {
}

ngOnInit(): void {
  if (this.activatedRoute.snapshot.params.requestId) {
      setTimeout(() => {
          this.searchTransferRequestComponent?.onSelectAction({
              transferFromStoreId: this.activatedRoute.snapshot.params.transferFromStoreId,
              transferId: this.activatedRoute.snapshot.params.requestId,
              transferStatus: this.activatedRoute.snapshot.params.requestStatus,
              navigateOption: NavigationOptions.VIEW_DETAILS,
              action: '',
              approvalUser: '',
              comments: '',
              createDate: '',
              transferStatusId: '',
              transferToStoreId: this.activatedRoute.snapshot.params.transferToStoreId,
              transferToStoreName: '',
              transferFromStoreName: '',
              createUser: ''
          });
      }, 0);
  }
}

onSelectTransferRequestBCBC(event: Content) {
  if (event.navigateOption === 'N/A') {
      return;
  }
  this.isBCToBC = true;
  this.selectedRow = event;
  this.displayScreen = event.navigateOption;
}
onSelectTransferRequestWHBC(event: Content) {
  if (event.navigateOption === 'N/A') {
      return;
  }
  this.isBCToBC = false;
  this.selectedRow = event;
  this.displayScreen = event.navigateOption;
  if (this.displayScreen === 'Acknowledge') {
      this.displayScreen = NavigationOptions.START_ACKNOWLEDGE;
  }
}

onBackClick(): void {
  this.displayScreen = NavigationOptions.SEARCH;
}

onAcknowledgeBackClick(): void {
  this.displayScreen = this.isBCToBC ? (this.selectedRow?.navigateOption as NavigationOptions) : NavigationOptions.SEARCH;
}

onApproveRejectClick(): void {
  this.displayScreen = NavigationOptions.START_APPROVE_REJECT;
}

onTransferSerialNumberClick(row:StockTransferItemDetails): void {
  this.itemRow = row;
  this.transferSummaryNavigatedFrom = 'MAIN';
  this.displayScreen = NavigationOptions.START_TRANSFER_STOCK;
}

onStartAcknowledgeClick(row:StockTransferItemDetails): void {
  this.itemRow = row;
  this.displayScreen = NavigationOptions.START_ACKNOWLEDGE;
}

onApproveClick(): void {
  this.displayScreen = NavigationOptions.START_APPROVE_REJECT_SUMMARY;
}

onStockTransferDoneClick(): void {
  this.displayScreen = NavigationOptions.START_TRANSFER_STOCK_SUMMARY;
}

onViewSummaryDoneClick(): void {
  this.displayScreen = NavigationOptions.VIEW_DETAILS;
}
onViewAcknowledgeSummaryClick():void{
  this.displayScreen=NavigationOptions.ACKNOWLEDGE_TRANSFER_STOCK_SUMMARY;
}
onViewSummaryOnStockTransferSerials():void{
  this.displayScreen = NavigationOptions.APPROVE_REJECT;
}
onViewCCPDealerAcknowledgeSummary(event: Content){
  this.selectedRow = event;
  this.displayScreen = NavigationOptions.ACKNOWLEDGE_TRANSFER_STOCK_SUMMARY;
}
onViewCCPDealerAcknowledgeSummaryInit(event:string){
  this.summaryRequestId = event;
  this.displayScreen = NavigationOptions.ACKNOWLEDGE_TRANSFER_STOCK_SUMMARY;
}

public setHeadingBarInputData(): { title: string, screenToNavigate: NavigationOptions } {
  let headingInputData = {title: 'Back to Track Stock Transfer', screenToNavigate: NavigationOptions.SEARCH};
  switch (this.displayScreen) {
      case NavigationOptions.ACKNOWLEDGE:
      case NavigationOptions.VIEW_DETAILS:
      case NavigationOptions.UPDATE:
      case NavigationOptions.APPROVE_REJECT:
          headingInputData = {title: 'Back to Track Stock Transfer', screenToNavigate: NavigationOptions.SEARCH};
          break;
      case NavigationOptions.START_ACKNOWLEDGE:
          headingInputData = {title: 'Acknowledge Stock Transfer', screenToNavigate: this.isBCToBC ?
                  (this.selectedRow?.navigateOption as NavigationOptions) : NavigationOptions.SEARCH};
          break;
      case NavigationOptions.START_APPROVE_REJECT:
          headingInputData = {
              title: 'Stock Transfer/Request Acceptance',
              screenToNavigate: this.selectedRow?.navigateOption as NavigationOptions
          };
          break;
      case NavigationOptions.START_APPROVE_REJECT_SUMMARY:
          headingInputData = {
              title: 'Acceptance Stock Transfer Summary',
              screenToNavigate: NavigationOptions.START_APPROVE_REJECT
          };
          break;
      case NavigationOptions.START_TRANSFER_STOCK:
          headingInputData = {
              title: 'Back to Track Request Summary',
              screenToNavigate: this.transferSummaryNavigatedFrom === 'START_APPROVE_REJECT_SUMMARY' ?
                  NavigationOptions.START_APPROVE_REJECT_SUMMARY : (this.selectedRow?.navigateOption as NavigationOptions)
          };
          break;
      case NavigationOptions.START_TRANSFER_STOCK_SUMMARY:
          headingInputData = {title: 'Stock Transfer Summary', screenToNavigate: NavigationOptions.START_TRANSFER_STOCK};
          break;
      case NavigationOptions.ACKNOWLEDGE_TRANSFER_STOCK_SUMMARY:
          headingInputData = {title: 'Back to Track Stock Transfer', screenToNavigate: NavigationOptions.SEARCH};
          break;
  }
  return headingInputData;
}



}
