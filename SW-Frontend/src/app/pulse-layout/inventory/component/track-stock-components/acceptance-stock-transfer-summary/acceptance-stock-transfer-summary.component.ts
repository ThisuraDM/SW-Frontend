import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    BcViewStockTransferDetailsBcToBc,
    StockTransferItemDetails,
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { printItem, RequestSummaryRequest } from '@app/SW-layout/inventory/models/bc-view-stock-request-summary';

@Component({
    selector: 'SW-acceptance-stock-transfer-summary',
    templateUrl: './acceptance-stock-transfer-summary.component.html'
})
export class AcceptanceStockTransferSummaryComponent implements OnInit {

    @Output() doneClick = new EventEmitter();
    @Output() transferSerialNumberClick = new EventEmitter();
    @Output() backClick = new EventEmitter<boolean>();

    @Input() requestId = '';

    public stockTransferDetails: BcViewStockTransferDetailsBcToBc;
    public tableDataList = new Array<StockTransferItemDetails>();
    public requestSummaryRequest: RequestSummaryRequest;


    constructor(private bcViewStockService: BcViewStockService,
                private stockService: BcViewStockService) {
        this.requestSummaryRequest = {
            remarks: '',
            storeId: '',
            storeName: '',
            listOfItems: [],
        };
        this.stockTransferDetails = {
            approved_date: '',
            approved_user: '',
            create_date: '',
            create_user: '',
            destination_outlet_name: '',
            destination_outlet_store_id: '',
            enable_acknowledge: false,
            enable_approve_reject: false,
            enable_transfer_serial: false,
            last_status_updated_date: '',
            last_status_updated_by:'',
            origin_outlet_name: '',
            origin_outlet_store_id: '',
            remarks: '',
            request_id: '',
            status: '',
            serial_product: true,
            transfer_date: '',
            transfer_user: '',
            item_details: [],
        };
    }

    ngOnInit(): void {
        this.getPageLoadData();
    }

    onDoneClick(): void {
        this.doneClick.emit();
    }

    onTransferSerialNumberClick(): void {
        this.transferSerialNumberClick.emit();
    }

    private getPageLoadData(): void {
        this.bcViewStockService.getStockTransferDetails(this.requestId).subscribe(res => {
            this.stockTransferDetails = res;
            this.tableDataList = res?.item_details || [];
        });
    }

    printSummary() {
        this.requestSummaryRequest.storeId = this.stockTransferDetails.destination_outlet_store_id;
        this.requestSummaryRequest.storeName = this.stockTransferDetails.destination_outlet_name;
        this.requestSummaryRequest.remarks = this.stockTransferDetails.remarks;
        this.requestSummaryRequest.listOfItems = [];
        this.tableDataList.forEach(value => {
            const item: printItem = {
                acknowledgeQuantity: +value.received_quantity,
                itemName: value.item_name,
                sapMaterialCode: value.sap_material_code,
                transferQuantity: +value.transfer_quantity,
                approvedQuantity: +value.approved_quantity,
                requestedQuantity: +value.requested_quantity
            };
            this.requestSummaryRequest.listOfItems.push(item);
        });

        this.stockTransferDetails.item_details.length >= 0 ? this.stockTransferDetails.item_details : [];

        this.stockService.printSummary(this.requestSummaryRequest).subscribe(response => {
            const file = new Blob([response], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = fileURL;
            a.download = `Stock request summary (BC-BC).pdf`;
            a.click();
            document.body.removeChild(a);
        }, (error) => {
            console.log(error);
        });
    }
}
