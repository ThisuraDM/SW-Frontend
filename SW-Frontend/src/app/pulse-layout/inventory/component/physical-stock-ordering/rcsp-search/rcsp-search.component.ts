import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DealerPhysicalStockOrderingService } from '@app/SW-layout/inventory/services/dealer-physical-stock-ordering.service';
import { SearchItems } from '@app/SW-layout/inventory/models/bc-view-stock';

@Component({
  selector: 'SW-rcsp-search',
  templateUrl: './rcsp-search.component.html',
  styleUrls: ['./rcsp-search.component.scss']
})
export class RcspSearchComponent implements OnInit {

  @Input() isPromo = false;
  @Input() selectedOutlet = '';

  @Output() setSearchParameter = new EventEmitter<SearchItems>();

  public searchItemObj: SearchItems = {
      itemName: '',
      sapCode: '',
      category: '',
  };
  public selectedSapCode = '';
  public selectedItemName = '';
  public selectedCategory = '';

  public products: string[] = [];
  constructor(private StockService: DealerPhysicalStockOrderingService) { }

  ngOnInit(): void {
      this.getRcSpProducts();
  }

  searchItems() {
      this.searchItemObj.itemName = this.selectedItemName;
      this.searchItemObj.sapCode = this.selectedSapCode;
      this.searchItemObj.category = this.selectedCategory;
      this.setSearchParameter.emit(this.searchItemObj);
  }
  getRcSpProducts() {
    this.StockService.getSpRcProducts(
      this.selectedOutlet
    ).subscribe(response => {
      this.products = response;
    });
  }

}
