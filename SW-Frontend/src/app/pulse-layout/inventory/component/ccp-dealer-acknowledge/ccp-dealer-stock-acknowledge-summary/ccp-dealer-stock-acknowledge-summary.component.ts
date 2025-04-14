import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BcViewStockTransferDetailsBcToBc, StockTransferItemDetails, ViewAcknowledgeSummaryList } from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { BcSearchStockService } from '@app/SW-layout/inventory/services/bc-search-stock.service';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { ToastService } from '@common/services';

@Component({
  selector: 'SW-ccp-dealer-stock-acknowledge-summary',
  templateUrl: './ccp-dealer-stock-acknowledge-summary.component.html',
  styleUrls: ['./ccp-dealer-stock-acknowledge-summary.component.scss']
})
export class CcpDealerStockAcknowledgeSummaryComponent implements OnInit {

  @Input() requestId = '';
  @Input() summaryRequestId = '';
  
  @Output() backClick = new EventEmitter<boolean>();
  
  public stockTransferDetails: BcViewStockTransferDetailsBcToBc = {
    approved_date: '',
    approved_user: '',
    create_date: '',
    create_user: '',
    destination_outlet_name: '',
    destination_outlet_store_id: '',
    enable_acknowledge: false,
    enable_approve_reject: false,
    enable_transfer_serial: false,
    item_details: [],
    last_status_updated_date: '',
    origin_outlet_name: '',
    origin_outlet_store_id: '',
    remarks: '',
    request_id: '',
    serial_product: false,
    status: '',
    transfer_date: '',
    transfer_user: '',
    last_status_updated_by: ''
  };
  public tableDataList: StockTransferItemDetails[] = [];
  public tableData: ViewAcknowledgeSummaryList[] = [];
  public status = '';
  constructor(private bcViewStockService: BcViewStockService,
    private bcSearchStockService: BcSearchStockService,
    private toastService: ToastService,) { }

  ngOnInit(): void {
    if(this.summaryRequestId == ''){

    }else{
      this.requestId = this.summaryRequestId;
    }
    this.getStocks();
  }

  getStocks() {
    this.bcViewStockService.getStockTransferDetails(this.requestId).subscribe(res => {
      this.stockTransferDetails = res;
      this.tableDataList = this.stockTransferDetails?.item_details || [];
      this.status = this.stockTransferDetails?.status;

      this.tableDataList.forEach(element => { 
        element.serial_numbers.forEach(element2 => {
          const loopItem: ViewAcknowledgeSummaryList = {
            item_name: '',
            serial: ''
          }
          loopItem.item_name = element.item_name
          loopItem.serial = element2
          this.tableData.push(loopItem);
        });

      });

      console.log(this.tableDataList);
      console.log(this.tableData);
    });
  }

  onConfirmClick(){
    this.backClick.emit(true);
  }

  onDownloadClick(){
    this.bcSearchStockService.onCCPDealerPrintAcknowledgeSummary(this.stockTransferDetails.destination_outlet_store_id,this.requestId)
      .subscribe(response => {
          const file = new Blob([response.body as BlobPart], { type: 'data:application/vnd.ms-excel' });
          const fileURL = URL.createObjectURL(file);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = fileURL;
          a.download = 'ccpDealerAcknowledgeSummary.xls';
          a.click();
          document.body.removeChild(a);
      }, (error) => {
          this.toastService.show('Unable to download', 'Unable to download the Excel file.');
      });
  }
}
