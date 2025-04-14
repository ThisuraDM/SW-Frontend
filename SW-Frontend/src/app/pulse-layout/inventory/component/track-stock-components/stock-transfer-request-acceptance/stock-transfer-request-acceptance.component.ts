import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import {
    ApproveStockTransferRequest,
    BcViewStockTransferDetailsBcToBc,
    RejectStockTransferRequest,
    StockTransferItemDetails,
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { ToastService } from '@common/services';
import { LocalStorageService } from '../../../../../../services/local-storage.service';

@Component({
    selector: 'SW-stock-transfer-request-acceptance',
    templateUrl: './stock-transfer-request-acceptance.component.html',
    styleUrls: ['./stock-transfer-request-acceptance.component.scss'],
})
export class StockTransferRequestAcceptanceComponent implements OnInit {

    @Output() approveClick = new EventEmitter<boolean>();
    @Output() rejectClick = new EventEmitter<boolean>();
    @Input() requestId = '';
    @Output() backClick = new EventEmitter<boolean>();

    remark: string = '';

    public stockTransferDetails!: BcViewStockTransferDetailsBcToBc;
    public tableDataList = new Array<StockTransferItemDetails>();
    public rejectStockTransferRequest: RejectStockTransferRequest;
    public approveStockTransferRequest: ApproveStockTransferRequest;

    constructor(private bcViewStockService: BcViewStockService,
                private localStorageService: LocalStorageService,
                private toastService: ToastService,) {
            this.approveStockTransferRequest = {
            list_of_items: [],
            login_user: '',
            remarks: '',
            transfer_from_store_id: '',
            transfer_to_store_id: '',
        };
        this.rejectStockTransferRequest = {
            list_of_items: [],
            login_user: '',
            remarks: '',
            transfer_from_store_id: '',
            transfer_to_store_id: '',
        };
    }

    ngOnInit(): void {
        this.getPageLoadData();
    }

    approve() {
        this.approveStockTransferRequest.list_of_items = [];
        this.tableDataList.forEach(value => {
            const items = {
                approved_quantity: +value.approved_quantity,
                request_quantity: +value.requested_quantity,
                item_name: value.item_name,
                sap_material_code: value.sap_material_code,
            };
            this.approveStockTransferRequest.list_of_items.push(items);
        });
        this.approveStockTransferRequest.login_user = this.localStorageService.get('name');
        this.approveStockTransferRequest.remarks = this.remark;
        this.approveStockTransferRequest.transfer_from_store_id = this.stockTransferDetails.origin_outlet_store_id !== null ? this.stockTransferDetails.origin_outlet_store_id : '';
        this.approveStockTransferRequest.transfer_to_store_id = this.stockTransferDetails.destination_outlet_store_id !== null ? this.stockTransferDetails.destination_outlet_store_id : '';

        this.bcViewStockService.stockTransferApprove(this.approveStockTransferRequest, this.requestId)
            .subscribe(res => {
                if (res.status.toLowerCase() == 'success') {
                    this.approveClick.emit(true);
                }
            }, error => {
                this.toastService.show('Error', error.error.errorMessage);
            });
    }

    reject() {
        this.rejectStockTransferRequest.list_of_items = [];
        this.tableDataList.forEach(value => {
            const items = {
                request_quantity: +value.requested_quantity,
                sap_material_code: value.sap_material_code,
            };
            this.rejectStockTransferRequest.list_of_items.push(items);
        });
        this.rejectStockTransferRequest.login_user =  this.localStorageService.get('name');
        this.rejectStockTransferRequest.remarks = this.remark;
        this.rejectStockTransferRequest.transfer_from_store_id = this.stockTransferDetails.origin_outlet_store_id !== null ? this.stockTransferDetails.origin_outlet_store_id : '';
        this.rejectStockTransferRequest.transfer_to_store_id = this.stockTransferDetails.destination_outlet_store_id !== null ? this.stockTransferDetails.destination_outlet_store_id : '';

        this.bcViewStockService.stockTransferReject(this.rejectStockTransferRequest, this.requestId)
            .subscribe(res => {
                if (res.status.toLowerCase() == 'success') {
                    this.rejectClick.emit(true);
                }
            }, error => {
                this.toastService.show('Error', error.error.errorMessage);
            });
    }

    private getPageLoadData(): void {
        this.bcViewStockService.getStockTransferDetails(this.requestId)
            .subscribe(res => {
                this.stockTransferDetails = res;
                this.tableDataList = res?.item_details || [];
            });
    }

    setAllRequestQty(index: number, quantity: string) {
        this.tableDataList[index].approved_quantity = quantity;
    }
}
