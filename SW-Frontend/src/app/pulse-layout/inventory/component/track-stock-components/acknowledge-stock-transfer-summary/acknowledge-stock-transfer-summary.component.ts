import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { AcknowlegeSaveRequest } from '@app/SW-layout/inventory/models/bc-ackowledge-details';
import { BcSearchStockService } from '@app/SW-layout/inventory/services/bc-search-stock.service';
import { ToastService } from '@common/services';

@Component({
  selector: 'SW-acknowledge-stock-transfer-summary',
  templateUrl: './acknowledge-stock-transfer-summary.component.html'
})
export class AcknowledgeStockTransferSummaryComponent implements OnInit,OnChanges {
  @Output() onDoneClick = new EventEmitter<boolean>();

  @Input() acknowledgeRequest?: AcknowlegeSaveRequest;
  @Input() storeId = '';
  @Input() isBC_BC = true;
  @Input() origin_outlet_store_name = '';
  @Input() requestId = 'TOW1361-29';



  public pageNumber = 0;
  constructor(private changeDetectorRef:ChangeDetectorRef,
    private bcSearchStockService: BcSearchStockService,
        private toastService: ToastService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes){
      this.changeDetectorRef.detectChanges()
    }
  }

  ngOnInit(): void {
  }
  onAcknowledge(){
    this.onDoneClick.emit(true);
  }

  onPrint() {
    let listOfItems = this.acknowledgeRequest?.list_of_item_details_request.map(i => {
      return {
        acknowledgeQuantity: i.transfer_quantity,
        itemName: i.item_name,
        sapMaterialCode: i.sap_material_code,
        transferQuantity: i.transfer_quantity
      }
    })
    var request = {
      listOfItems: listOfItems,
      remarks: this.acknowledgeRequest?.remark,
      storeId: this.storeId,
      storeName: this.acknowledgeRequest?.destination_outlet
    };
    this.bcSearchStockService.onPrintAcknowledgeSummary(request).subscribe(res => {
      if (res) {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = fileURL;
        const date = new Date();
        a.download = `Acknowledge Stock Transfer Summary.pdf`;
        a.click()
      }
    }, (error) => {
      this.toastService.show('Error', error.error.errorMessage || '')
    });
  }

}
