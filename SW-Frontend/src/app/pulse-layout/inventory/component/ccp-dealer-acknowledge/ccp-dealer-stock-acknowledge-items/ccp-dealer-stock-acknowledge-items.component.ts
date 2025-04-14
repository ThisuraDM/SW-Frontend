import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Outlets } from '@app/SW-layout/dashboard/models/region-outlets';
import { AcknowledgeSaveItemType, AcknowlegeSaveRequest } from '@app/SW-layout/inventory/models/bc-ackowledge-details';
import {
    ApproveStockTransferRequest,
    BcViewStockTransferDetailsBcToBc,
    RejectStockTransferRequest,
    StockTransferItemDetails,
    StockTransferItemList,
    StockTransferSerialRequest
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { Content, NavigationOptions } from '@app/SW-layout/inventory/models/trasfer-details';
import { BcSearchStockService } from '@app/SW-layout/inventory/services/bc-search-stock.service';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { InventoryState } from '@app/SW-layout/inventory/state/inventory-data-reducer';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Store } from '@ngrx/store';
import { StorageSettings } from 'constants/StorageSettings';
import { LocalStorageService } from 'services/local-storage.service';
import { State } from 'state/app-state';

import * as InventoryStoreDetails from './../../../state/inventory-data-action';


@Component({
    selector: 'SW-ccp-dealer-stock-acknowledge-items',
    templateUrl: './ccp-dealer-stock-acknowledge-items.component.html',
    styleUrls: ['./ccp-dealer-stock-acknowledge-items.component.scss']
})
export class CcpDealerStockAcknowledgeItemsComponent implements OnInit {

    @Input() requestId = '';
    @Input() outletId = '';
    @Input() screenType: NavigationOptions = NavigationOptions.APPROVE_REJECT;
    @Input() status = '';

    @Output() viewSummaryCCPDealerAcknowledgeInit = new EventEmitter<string>();
    @Output() backClick = new EventEmitter<boolean>();
    @Output() approveRejectClick = new EventEmitter<boolean>();
    @Output() startAcknowledgeClick = new EventEmitter<StockTransferItemDetails>();
    @Output() transferSerialNumberClick = new EventEmitter<StockTransferItemDetails>();
    @Output() transferSerialNumberClick2 = new EventEmitter<BcViewStockTransferDetailsBcToBc>();

    public displayedScreen: 'main' | 'stock-transfer' = 'main';
    public userType: 'origin-user' | 'destination-user' = 'origin-user';
    public approverStatus: 'Pending Approval' | 'Pending Serial' | 'Approved & Verified' | 'Rejected' = 'Pending Approval';
    public approverPage = 0;
    public requestorPage = 0;
    public approveQtyPage = false;
    public remark = '';
    public showTransferSerial = false;

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
    public stockTransferDetailsFromStore: BcViewStockTransferDetailsBcToBc = {
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
    public summaryRequest: AcknowlegeSaveRequest = {
        list_of_item_details_request: [],
        remark: ''
    };
    public tableDataList: StockTransferItemDetails[] = [];
    public rejectStockTransferRequest: RejectStockTransferRequest = {
        list_of_items: [],
        login_user: '',
        remarks: '',
        transfer_from_store_id: '',
        transfer_to_store_id: ''
    };

    public approveStockTransferRequest: ApproveStockTransferRequest = {
        list_of_items: [],
        login_user: '',
        remarks: '',
        transfer_from_store_id: '',
        transfer_to_store_id: ''
    };

    public historicalDataModalRef?: NgbModalRef;
    public rejectModalRef?: NgbModalRef;
    public submitModalRef?: NgbModalRef;
    public disableSubmit = false;

    @ViewChild('modalAcknowledge', { static: true }) acknowledgePopup!: TemplateRef<any>;

    constructor(
        private bcSearchStockService: BcSearchStockService,
        private modalService: NgbModal,
        private bcViewStockService: BcViewStockService,
        private localStorageService: LocalStorageService,
        private toastService: ToastService,
        private store: Store<State>,
        private getStore: Store<{ Inventory: InventoryState }>
    ) {
    }

    ngOnInit(): void {
        this.getStoreData();
        this.getPageLoadData();
        this.disableSubmit = true;
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    onPendingRequestClick(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}): void {
        this.historicalDataModalRef = this.modalService.open(content, modalOptions);
    }

    onStartAcknowledgeClick(item: StockTransferItemDetails) {
        this.startAcknowledgeClick.emit(item);
    }

    private getPageLoadData(): void {
        this.getStocks();
    }

    getStoreData() {
        this.getStore.select('Inventory').subscribe((data) => {
            console.log(data.stockTransferDetail);
            this.stockTransferDetailsFromStore = data.stockTransferDetail;
        });
    }

    getStocks() {
        this.bcViewStockService.getStockTransferDetailsCCP(this.requestId,this.outletId).subscribe(res => {
            this.stockTransferDetails = res;
            this.tableDataList = this.stockTransferDetails?.item_details || [];
            this.status = this.stockTransferDetails?.status;
            this.remark = this.stockTransferDetails?.remarks;
            const loggedInOutletId = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id;
            if (loggedInOutletId === this.stockTransferDetails?.origin_outlet_store_id) {
                this.userType = 'origin-user';
            } else if (loggedInOutletId === this.stockTransferDetails?.destination_outlet_store_id) {
                this.userType = 'destination-user';
            }

            console.log(this.status.toUpperCase());
            if (this.status.toUpperCase() == 'INBOUND-PICKING') {
                this.requestorPage = 1
            }
            else if (this.status.toUpperCase() == 'IN-TRANSIT') {
                if (this.stockTransferDetailsFromStore.request_id !== '') {
                    this.stockTransferDetails = this.stockTransferDetailsFromStore;
                    this.tableDataList = Object.values(this.stockTransferDetails?.item_details || []);
                    this.store.dispatch(InventoryStoreDetails.setAcknowledgeItemDetails({ input: this.tableDataList }));
                } else {
                    this.store.dispatch(InventoryStoreDetails.setAcknowledgeTransferDetails({ input: this.stockTransferDetails }));
                }
                this.requestorPage = 2
            }
            else if (this.status.toUpperCase() == 'RECEIVED') {
                this.requestorPage = 3
            }
        });
    }

    checkAllVerified() {
        console.log(this.requestorPage);
        if(this.requestorPage == 1){
            return false;
        }else{
            let count = 0;
            this.stockTransferDetailsFromStore.item_details.forEach(element => {
                if (element.isVerified)
                    count++;
            });
            if (this.stockTransferDetailsFromStore.item_details.length == count) {
                this.disableSubmit = false;
                return true;
            } else {
                return false;
            }
        }   
    }

    onAcknowledgeClick() {
        this.disableSubmit = true;
        const list_of_item_details_request = new Array<AcknowledgeSaveItemType>();
        this.stockTransferDetailsFromStore.item_details.forEach(item => {
            list_of_item_details_request.push(
                {
                    approved_quantity: item.approved_quantity,
                    item_name: item.item_name,
                    received_quantity: item.transfer_quantity + '',
                    requested_quantity: item.requested_quantity,
                    sap_material_code: item.sap_material_code,
                    sequence: null,
                    serial_no_list: item.serial_numbers,
                    transfer_quantity: item.transfer_quantity
                }
            )
        })

        this.summaryRequest = {
            approval_user: this.stockTransferDetailsFromStore?.approved_user,
            approved_at: this.stockTransferDetailsFromStore?.approved_date,
            destination_outlet: this.stockTransferDetailsFromStore?.destination_outlet_store_id,
            list_of_item_details_request: list_of_item_details_request,
            origin_outlet: this.stockTransferDetailsFromStore?.origin_outlet_store_id,
            remark: this.remark,
            serial: this.stockTransferDetailsFromStore?.serial_product || undefined,
            ship_user: '',
            transferred_at: this.stockTransferDetailsFromStore?.transfer_date,
            transferred_by: this.stockTransferDetailsFromStore?.transfer_user
        };
        this.bcSearchStockService.transferAckowledge(this.requestId, this.summaryRequest, 'WH').subscribe(res => {
            if (res) {
                this.modalService.open(this.acknowledgePopup, { centered: true, size: 'md' });
                this.disableSubmit = false;
            }
        }, (error) => {
            this.disableSubmit = false;
            this.toastService.show('Error', error.error.errorMessage)
        })

    }

    submitClose() {
        this.modalService.dismissAll();
        this.viewSummaryCCPDealerAcknowledgeInit.emit(this.requestId);
    }

}
