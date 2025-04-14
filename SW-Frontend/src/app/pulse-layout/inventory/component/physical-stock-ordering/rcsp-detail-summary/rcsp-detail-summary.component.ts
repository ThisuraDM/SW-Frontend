import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PrintDetails, StockRequestSummary } from '@app/SW-layout/inventory/models/bc-view-stock-request-summary';
import { DealerConfirmStockOrderDeliveryDetailsRequest } from '@app/SW-layout/inventory/models/dealer-confirm-stock-order-delivery-details';
import {
    RcspCreateStockResponse,
    RcspPromotions,
    RcspStockItem,
} from '@app/SW-layout/inventory/models/dealer-physical-stock-ordering';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { LocalStorageService } from 'services/local-storage.service';

@Component({
  selector: 'SW-rcsp-detail-summary',
  templateUrl: './rcsp-detail-summary.component.html',
  styleUrls: ['./rcsp-detail-summary.component.scss']
})
export class RcspDetailSummaryComponent implements OnInit {

  @Input() requestId = '';
  @Input() type = 'return';
  @Input() confirmResponse?: RcspCreateStockResponse;
  @Input() selectedItems?: RcspStockItem[];
  @Input() prevDetails?:DealerConfirmStockOrderDeliveryDetailsRequest;
  @Input() selectedPromo?:RcspPromotions;
  @Input() isPromo? = false;

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

  constructor(private StockService: BcViewStockService,
     private localStorageService: LocalStorageService,
     private router: Router) { }

  ngOnInit(): void {
  }

    onTrackClick(): void {
      this.router.navigateByUrl('/store/inventory', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/store/inventory/dealer-track-stock-transfer']);
    });
    }

    onRequestMoreClick() {
        this.router.navigateByUrl('/store/inventory', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/store/inventory/dealer-physical-stock-ordering']);
        });
    }
}
