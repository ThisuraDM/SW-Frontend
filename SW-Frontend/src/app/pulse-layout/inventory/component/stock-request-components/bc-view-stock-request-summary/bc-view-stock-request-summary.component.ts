import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';

import { PrintDetails, PrintItems, StockRequestSummary } from './../../../models/bc-view-stock-request-summary';
import { BcViewStockService } from './../../../services/bc-view-stock.service';

@Component({
  selector: 'SW-bc-view-stock-request-summary',
  templateUrl: './bc-view-stock-request-summary.component.html',
  styleUrls: ['./bc-view-stock-request-summary.component.scss']
})
export class BcViewStockRequestSummaryComponent implements OnInit {
  @Input() requestId = '';
  @Input() type = 'return';
  @Output() returnToPreviousScreen = new EventEmitter();

  public stockRequestSummary! : StockRequestSummary;
  public printDetails: PrintDetails = {
    fromStoreAddress: '',
    fromStoreId: '',
    fromStoreName: '',
    listOfItems: [],
    item_name: '',
    requestDate: '',
    requestId: '',
    requestStatus: '',
    storeId: '',
    storeName: ''
  };
  public errorMessage = 'No results found'

  constructor(private StockService: BcViewStockService,
     private localStorageService: LocalStorageService,
     private router: Router) { }

  ngOnInit(): void {
    this.getThresholdCollectionList();
  }

  getThresholdCollectionList() {
    const outletsID = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
    this.StockService.getStockRequestSummary(outletsID, this.requestId).subscribe((stockRequestSummary: StockRequestSummary) => {
      if (stockRequestSummary != null) {
          this.stockRequestSummary = stockRequestSummary;
      }else{

      }
    });
  }

  printSummary(){
    this.printDetails.fromStoreAddress = this.stockRequestSummary.origin_outlet_name;
    this.printDetails.fromStoreId = this.stockRequestSummary.origin_outlet_store_id;
    this.printDetails.fromStoreName = this.stockRequestSummary.origin_outlet_name;
    this.printDetails.requestDate = this.stockRequestSummary.create_date;
    this.printDetails.requestId = this.stockRequestSummary.request_id;
    this.printDetails.requestStatus = this.stockRequestSummary.status;
    this.printDetails.storeId = this.stockRequestSummary.destination_outlet_store_id;
    this.printDetails.storeName = this.stockRequestSummary.destination_outlet_name;
    this.printDetails.listOfItems = [];
    this.stockRequestSummary.item_details.forEach(item => {
      const printItem:PrintItems ={
        sapMaterialCode: '',
        category: '',
        brand: '',
        itemName: '',
        quantity: 0
      };
      printItem.brand = item.brand;
      printItem.category = item.category;
      printItem.itemName = item.item_name;
      printItem.quantity = item.requested_quantity;
      printItem.sapMaterialCode = item.sap_material_code;
      this.printDetails.listOfItems.push(printItem);
    });

    this.StockService.printSummaryBc(this.printDetails).subscribe(response => {
      const file = new Blob([response.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = fileURL;
      const date = new Date();
      a.download = date + ' - stock summary.pdf';
      a.click()
    }, (error) => {
      // this.toastService.show('CPD download failed', 'CPD report file download failed. Please try again');
    });

  }
  redirectBack(){
    this.router.navigate(['../bc-stock-request-other-store']);
  }

    onTrackClick(): void {
      this.router.navigate([
          '/store/inventory/bc-track-stock-transfer-bc-to-bc',
          this.requestId,
          this.stockRequestSummary?.status,
          this.stockRequestSummary?.origin_outlet_store_id,
          this.stockRequestSummary?.destination_outlet_store_id
      ]);
    }

}
