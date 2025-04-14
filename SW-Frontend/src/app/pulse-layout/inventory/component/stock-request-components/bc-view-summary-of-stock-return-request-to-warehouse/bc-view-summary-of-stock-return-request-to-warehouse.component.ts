import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import { RequestSummaryReturnItemList, ReturnItemList, StockReturnRequestSummaryRequest } from '@app/SW-layout/inventory/models/bc-stock-return';
import {
    BcViewStockTransferDetailsBcToBc,
    StockTransferItemDetails,
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { LocalStorageService } from 'services/local-storage.service';

@Component({
    selector: 'SW-bc-view-summary-of-stock-return-request-to-warehouse',
    templateUrl: './bc-view-summary-of-stock-return-request-to-warehouse.component.html',
    styleUrls: ['./bc-view-summary-of-stock-return-request-to-warehouse.component.scss']
})
export class BcViewSummaryOfStockReturnRequestToWarehouseComponent implements OnInit {
    @Input() displayStockRequestReturnToWarehouse = false;
    @Input() requestId = '';
    @Output() displayStockRequestReturnToWarehouseChange = new EventEmitter<boolean>();
    @Output() resetPage = new EventEmitter<boolean>();

    public requestSummaryDetails: BcViewStockTransferDetailsBcToBc = {
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
        status: '',
        serial_product: true,
        transfer_date: '',
        transfer_user: '',
        last_status_updated_by: ''
    }
    public tableDataList = new Array<StockTransferItemDetails>();
    public printReturnRequestSummaryToWarehouseRequest: StockReturnRequestSummaryRequest = {
        requestDate: '',
        requestId: '',
        storeName: '',
        requestStatus: '',
        storeId: '',
        listOfItems: []
    }
    public pageNumber = 1;
    public disablePrintButton = true;

    constructor(
        private StockService: BcViewStockService,
        private localStorageService: LocalStorageService,
        private router: Router) {

    }

    ngOnInit(): void {
        this.getStockReturnRequestSummaryToWarehouse()
    }

    navigateBack(): void {
        this.displayStockRequestReturnToWarehouse = false
        this.displayStockRequestReturnToWarehouseChange.emit(false)
        this.resetPage.emit(true)
    }

    // requester Id should come from the confirm api result
    getStockReturnRequestSummaryToWarehouse = (): void => {
        const outletsID = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id ?? null;
        this.StockService.getStockReturnRequestSummaryToWarehouse(outletsID, this.requestId)
            .subscribe((stockRequestSummary: BcViewStockTransferDetailsBcToBc) => {
                if (stockRequestSummary != null) {
                    this.requestSummaryDetails = stockRequestSummary
                    this.tableDataList = stockRequestSummary.item_details
                    this.disablePrintButton = false
                } else {

                }
            });
    }

    printReturnRequestSummaryToWarehouse() {
        this.printReturnRequestSummaryToWarehouseRequest.requestDate = this.requestSummaryDetails.create_date;
        this.printReturnRequestSummaryToWarehouseRequest.requestId = this.requestSummaryDetails.request_id;
        this.printReturnRequestSummaryToWarehouseRequest.requestStatus = this.requestSummaryDetails.status;
        this.printReturnRequestSummaryToWarehouseRequest.storeId = this.requestSummaryDetails.destination_outlet_store_id;
        this.printReturnRequestSummaryToWarehouseRequest.storeName = this.requestSummaryDetails.destination_outlet_name;
        this.printReturnRequestSummaryToWarehouseRequest.listOfItems = [];
        this.requestSummaryDetails.item_details.forEach(item => {
            const printItem: RequestSummaryReturnItemList = {
                sapMaterialCode: '',
                category: '',
                brand: '',
                itemName: '',
                quantity: 0
            };
            printItem.brand = item.brand;
            printItem.category = item.category;
            printItem.itemName = item.item_name;
            printItem.quantity = +item.approved_quantity;
            printItem.sapMaterialCode = item.sap_material_code;
            this.printReturnRequestSummaryToWarehouseRequest.listOfItems.push(printItem);
        });


        this.StockService.printReturnRequestSummaryToWarehouse(this.printReturnRequestSummaryToWarehouseRequest).subscribe(response => {
            const file = new Blob([response.body], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = fileURL;
            const date = Math.floor(Date.now()/1000);;
            a.download = date + ' - Stock return request summary-BC.pdf';
            a.click()
        }, (error) => {
            // this.toastService.show('CPD download failed', 'CPD report file download failed. Please try again');
        });

    }

}
