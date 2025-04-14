import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '@common/services';
import { StockDetails } from '../../../models/view-stock-details';
import { BcViewStockService } from '../../../services/bc-view-stock.service';

@Component({
  selector: 'SW-bc-view-stock-level-details',
  templateUrl: './bc-view-stock-level-details.component.html',
  styleUrls: ['./bc-view-stock-level-details.component.scss']
})
export class BcViewStockLevelDetailsComponent implements OnInit {
  @Input()
  public storeId = '';
  @Input()
  public productName = '';
  @Input()
  public sapCode = '';
  @Output() onBackClick = new EventEmitter<boolean>();
  public stockResults:StockDetails|undefined;
  public pageNo = 0;
  tableDataList: any=[];
  constructor(private bcViewStockService: BcViewStockService,private toastService:ToastService ) {
   }

  ngOnInit(): void {
    this.loadPage(1)
  }

  loadPage(page: number) {
    this.pageNo = page - 1;
    this.bcViewStockService.getProductDetailView(this.pageNo,10,this.sapCode,this.storeId).subscribe(res=>{
      this.stockResults = res;
      this.tableDataList = res?.stock_detail_list?.content||[];
    });
  }
  onExport(){
    this.bcViewStockService.fileExportAndDownload(this.sapCode,this.storeId,this.productName).subscribe((response: any) => {
      const file = new Blob([response.body as BlobPart], {type: 'text/csv'});
                    const fileURL = URL.createObjectURL(file);
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = fileURL;
                    a.download = `Stock Level Details.csv`;
                    a.click();
                    document.body.removeChild(a);

  }, (error) => {
    this.toastService.show('Unable to download',  error.error.errorMessage||'');
});
  }


}
