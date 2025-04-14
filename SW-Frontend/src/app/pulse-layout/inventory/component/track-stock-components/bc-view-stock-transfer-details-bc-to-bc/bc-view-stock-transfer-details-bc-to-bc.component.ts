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
import { NavigationOptions } from '@app/SW-layout/inventory/models/trasfer-details';
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
    selector: 'SW-bc-view-stock-transfer-details-bc-to-bc',
    templateUrl: './bc-view-stock-transfer-details-bc-to-bc.component.html',
    styleUrls: ['./bc-view-stock-transfer-details-bc-to-bc.component.scss']
})
export class BcViewStockTransferDetailsBcToBcComponent implements OnInit, OnChanges {

    @Input() requestId = '';
    @Input() screenType: NavigationOptions = NavigationOptions.APPROVE_REJECT;
    @Input() status = '';

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
        serial_product: null,
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
        serial_product: null,
        status: '',
        transfer_date: '',
        transfer_user: '',
        last_status_updated_by: ''
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
    public summaryRequest: AcknowlegeSaveRequest = {
        list_of_item_details_request: [],
        remark: ''
    };

    public historicalDataModalRef?: NgbModalRef;
    public rejectModalRef?: NgbModalRef;
    public submitModalRef?: NgbModalRef;
    public isSerial :boolean | null = false;
    public disableSubmit = false;
    public disableAcknowledge = false

    @ViewChild('modalSubmit', { static: true }) submitPopup!: TemplateRef<any>;
    @ViewChild('modalAcknowledge', { static: true }) acknowledgePopup!: TemplateRef<any>;

    constructor(
        private modalService: NgbModal,
        private bcViewStockService: BcViewStockService,
        private bcSearchStockService: BcSearchStockService,
        private localStorageService: LocalStorageService,
        private toastService: ToastService,
        private store: Store<State>,
        private getStore: Store<{ Inventory: InventoryState }>
    ) {
    }

    ngOnInit(): void {
        this.getStoreData();
        this.getPageLoadData();
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    onPendingRequestClick(content: TemplateRef<unknown>, modalOptions: NgbModalOptions = {}): void {
        this.historicalDataModalRef = this.modalService.open(content, modalOptions);
    }

    onTransferSerialNumberClick(item: StockTransferItemDetails) {
        this.transferSerialNumberClick.emit(item);
        // this.showTransferSerial = true;
    }

    onStartAcknowledgeClick(item: StockTransferItemDetails){
        this.startAcknowledgeClick.emit(item);
    }

    onCancelRequestClick(): void {
    }

    onGetTotalClick(): void {
    }

    private getPageLoadData(): void {
        this.getStocks();
    }

    getStoreData() {
        this.getStore.select('Inventory').subscribe((data) => {
            this.stockTransferDetailsFromStore = data.stockTransferDetail;
        });
    }

    getStocks() {
        this.bcViewStockService.getStockTransferDetails(this.requestId).subscribe(res => {
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

           this.isSerial = this.stockTransferDetails.serial_product;

            if (this.status.toUpperCase() == 'OUTBOUND REJECTED REQUEST') {
                this.approverStatus = 'Rejected';
                this.approverPage = 6;
            }
            else if (this.status.toUpperCase() == 'PENDING REQUEST') {
                this.approverPage = 1
                this.approverStatus = 'Pending Approval';
            } else if (this.status.toUpperCase() == 'IN PROGRESS') {
                if (this.stockTransferDetailsFromStore.request_id !== '') {
                    this.stockTransferDetails = this.stockTransferDetailsFromStore;
                    this.tableDataList = Object.values(this.stockTransferDetails?.item_details || []);
                    this.store.dispatch(InventoryStoreDetails.setItemDetails({ input: this.tableDataList }));
                } else {
                    this.store.dispatch(InventoryStoreDetails.setstockTransferDetails({ input: this.stockTransferDetails }));
                }
                this.approverStatus = 'Pending Serial';
                this.approverPage = 3
            } else if (this.status.toUpperCase() == 'DISPATCHED') {
                this.approverStatus = 'Approved & Verified';
                this.approverPage = 5
                this.store.dispatch(InventoryStoreDetails.setstockTransferDetails({ input: this.stockTransferDetails }));
            } else if (this.status.toUpperCase() == 'AWAITING RESPONSE') {
                this.requestorPage = 1
            }
            else if (this.status.toUpperCase() == 'INBOUND PICKING') {
                this.requestorPage = 2
            }
            else if (this.status.toUpperCase() == 'IN-TRANSIT') {
                if(this.isSerial){
                    if (this.stockTransferDetailsFromStore.request_id !== '') {
                        this.stockTransferDetails = this.stockTransferDetailsFromStore;
                        this.tableDataList = Object.values(this.stockTransferDetails?.item_details || []);
                        this.store.dispatch(InventoryStoreDetails.setAcknowledgeItemDetails({ input: this.tableDataList }));
                    } else {
                        this.store.dispatch(InventoryStoreDetails.setAcknowledgeTransferDetails({ input: this.stockTransferDetails }));
                    }
                }    
                this.requestorPage = 3
            }
            else if (this.status.toUpperCase() == 'RECEIVED') {            
                this.requestorPage = 5
                this.store.dispatch(InventoryStoreDetails.setstockTransferDetails({ input: this.stockTransferDetails }));
            }
            else if (this.status.toUpperCase() == 'INBOUND REJECTED REQUEST') {
                this.requestorPage = 6
            }
            else if (this.status.toUpperCase() == 'CLOSED') {            
                this.approverPage = 5
                this.store.dispatch(InventoryStoreDetails.setstockTransferDetails({ input: this.stockTransferDetails }));
            }
        });
    }

    appRejClick() {
        this.approverPage = 2
    }

    appClick() {
        if (this.remark == '') {
            this.toastService.show('Error', 'Please add a remark');
            return
        } else if (this.checkAppQtyValid()) {
            this.toastService.show('Error', 'Please add a valid approve quantity');
            return
        } else {
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
            this.approveStockTransferRequest.transfer_from_store_id = this.stockTransferDetails.origin_outlet_store_id !== null
                ? this.stockTransferDetails.origin_outlet_store_id : '';
            this.approveStockTransferRequest.transfer_to_store_id = this.stockTransferDetails.destination_outlet_store_id !== null
                ? this.stockTransferDetails.destination_outlet_store_id : '';

            this.bcViewStockService.stockTransferApprove(this.approveStockTransferRequest, this.requestId)
                .subscribe(res => {
                    if (res.status.toLowerCase() == 'success') {
                        this.getStocks();
                    }
                }, error => {
                    this.toastService.show('Error', error.error.errorMessage);
                });
        }
    }

    checkAppQtyValid(): boolean {
        let errorCount = 0;
        this.tableDataList.forEach(element => {
            if (element.approved_quantity == '' || element.approved_quantity == null) {
                errorCount++
                return false;
            } else if ((Number(element.available_quantity) + Number(element.reserved_quantity)) - Number(element.approved_quantity) < 0) {
                errorCount++
                return false;
            } else if (Number(element.approved_quantity) > Number(element.requested_quantity)) {
                errorCount++
                return false;
            }
            else if (!element.approved_quantity?.match(/^[0-9]*$/)) {
                errorCount++
                return false;
            }
        });
        return errorCount > 0 ? true : false;
    }
    onRejectClick(content: TemplateRef<unknown>): void {
        this.rejectModalRef = this.modalService.open(content, { centered: true, size: 'md' });
    }
    closeClick() {
        this.backClick.emit();
    }

    confirmReject() {
        if (this.remark == '') {
            this.toastService.show('Error', 'Please add a remark');
        } else {
            this.rejectStockTransferRequest.list_of_items = [];
            this.tableDataList.forEach(value => {
                const items = {
                    request_quantity: +value.requested_quantity,
                    sap_material_code: value.sap_material_code,
                };
                this.rejectStockTransferRequest.list_of_items.push(items);
            });
            this.rejectStockTransferRequest.login_user = this.localStorageService.get('name');
            this.rejectStockTransferRequest.remarks = this.remark;
            this.rejectStockTransferRequest.transfer_from_store_id = this.stockTransferDetails.origin_outlet_store_id !== null
                ? this.stockTransferDetails.origin_outlet_store_id : '';
            this.rejectStockTransferRequest.transfer_to_store_id = this.stockTransferDetails.destination_outlet_store_id !== null
                ? this.stockTransferDetails.destination_outlet_store_id : '';

            this.bcViewStockService.stockTransferReject(this.rejectStockTransferRequest, this.requestId)
                .subscribe(res => {
                    if (res.status.toLowerCase() == 'success') {
                        this.rejectModalRef?.close();
                        this.getStocks();
                    }
                }, error => {
                    this.toastService.show('Error', error.error.errorMessage);
                });
        }

    }
    checkAllVerified() {
        let count = 0;
        if(this.isSerial){
            this.stockTransferDetailsFromStore.item_details.forEach(element => {
                if (element.isVerified)
                    count++;
            });
            if (this.stockTransferDetailsFromStore.item_details.length == count) {
                return false;
            } else {
                return true;
            }
        }else{
            return false;
        }
    
    }
    checkRecievedQty() :boolean{
        let count = 0;
        if(this.isSerial){
            return false;
        }else{
            this.tableDataList.forEach(element => {
                if(+element.received_quantity == +element.approved_quantity){
                    count++;
                }else{
                }   
            });
            if(this.stockTransferDetails.item_details.length === count){
                return false;
            }else{
                return true;
            }
        }
    }

    submitClick() {
        this.disableSubmit = true;
        this.bcViewStockService.saveStockTransferSerialNumbers(this.setSaveRequest(), this.requestId).subscribe(response => {
            if (response.status) {
                this.modalService.open(this.submitPopup, { centered: true, size: 'md' });
            }
        }, () => {
            this.disableSubmit = false;
            this.toastService.show('Unable to transfer', '');
        });

    }

    private setSaveRequest(): StockTransferSerialRequest {
        return {
            approval_user: this.stockTransferDetailsFromStore?.approved_user ?? '',
            approved_date: this.stockTransferDetailsFromStore?.approved_date ?? '',
            login_user: this.localStorageService.get(StorageSettings.LOGIN_NAME),
            list_of_items: this.stockTransferDetailsFromStore.item_details.map<StockTransferItemList>(item => {
                return {
                    approved_quantity: +item.approved_quantity,
                    item_name: item.item_name,
                    request_quantity: +item.requested_quantity,
                    sap_material_code: item.sap_material_code,
                    serial_number_list: item.added_serial_numbers ?? [],
                    transfer_quantity: this.stockTransferDetails?.serial_product === false ?
                        +item.approved_quantity : +item.approved_quantity
                }
            }),
            transfer_from_store_id: this.stockTransferDetailsFromStore?.origin_outlet_store_id ?? '',
            transfer_to_store_id: this.stockTransferDetailsFromStore?.destination_outlet_store_id ?? ''
        }
    }

    submitClose() {
        this.disableSubmit = false;
        this.getPageLoadData();
        this.approverStatus = 'Approved & Verified';
        this.approverPage = 5
        this.modalService.dismissAll();
    }

    acknowledgeClick(){
        this.disableAcknowledge = true;
        const list_of_item_details_request = new Array<AcknowledgeSaveItemType>();
        if(this.isSerial){
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
        }else{
            this.stockTransferDetails.item_details.forEach(item => {
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
                approval_user: this.stockTransferDetails?.approved_user,
                approved_at: this.stockTransferDetails?.approved_date,
                destination_outlet: this.stockTransferDetails?.destination_outlet_store_id,
                list_of_item_details_request: list_of_item_details_request,
                origin_outlet: this.stockTransferDetails?.origin_outlet_store_id,
                remark: this.remark,
                serial: this.stockTransferDetails?.serial_product || undefined,
                ship_user: '',
                transferred_at: this.stockTransferDetails?.transfer_date,
                transferred_by: this.stockTransferDetails?.transfer_user
            };
        }

        this.bcSearchStockService.transferAckowledge(this.requestId, this.summaryRequest, 'BC').subscribe(res => {
            if (res) {
                this.modalService.open(this.acknowledgePopup, { centered: true, size: 'md' });
            }
        }, (error) => {
            this.disableAcknowledge = false;
            this.toastService.show('Error', error.error.errorMessage)
        })
    }

    submitAcknowledgeClose(){
        this.disableAcknowledge = false;
        this.getPageLoadData();
        this.requestorPage = 5
        this.modalService.dismissAll();
    }

}
