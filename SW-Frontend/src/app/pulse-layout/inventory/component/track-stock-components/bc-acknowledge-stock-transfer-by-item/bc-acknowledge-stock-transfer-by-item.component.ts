import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TEMP_ACKNOWLEDGE_DATA } from '@app/SW-layout/dashboard/data/data';
import { AcknowledgeDetails, AcknowledgeSaveItemType, AcknowlegeSaveRequest, StockDetail, SummaryDetail, UnmatchedItems } from '@app/SW-layout/inventory/models/bc-ackowledge-details';
import { SearchFilterSerialNumberList, StockTransferItemDetails } from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { BcSearchStockService } from '@app/SW-layout/inventory/services/bc-search-stock.service';
import { State } from '@app/SW-layout/inventory/state/app-state';
import { InventoryState } from '@app/SW-layout/inventory/state/inventory-data-reducer';
import { ToastService } from '@common/services';
import { Store } from '@ngrx/store';

import * as InventoryStoreDetails from './../../../state/inventory-data-action';

@Component({
    selector: 'SW-bc-acknowledge-stock-transfer-by-item',
    templateUrl: './bc-acknowledge-stock-transfer-by-item.component.html',
    styleUrls: ['./bc-acknowledge-stock-transfer-by-item.component.scss']
})
export class BcAcknowledgeStockTransferByItemComponent implements OnInit {

    @Output() onviewAcknowledgeSummaryClick = new EventEmitter<boolean>();
    @Output() onDoneClick = new EventEmitter<boolean>();
    @Output() summaryClick = new EventEmitter<boolean>();


    @Input() requestId = '';
    @Input() storeId = '';
    @Input() isBC_BC = true;
    @Input() viewSummary = false;
    @Input() itemRow: StockTransferItemDetails = {
        approved_quantity: '',
        brand: '',
        category: '',
        description: '',
        item_name: '',
        received_quantity: '',
        requested_quantity: '',
        available_quantity: '',
        reserved_quantity: '',
        sap_material_code: '',
        serial_numbers: [],
        transfer_quantity: '',
        added_serial_numbers: [],
        isVerified: false,
        serial_number: ''
    }


    public acknowledgeForm = new FormGroup({});
    public transferItemTypes = ['Serial Number', 'SAP Material code'];
    public unmatchedItems = new Array<UnmatchedItems>();
    public acknowledgeResponse?: AcknowledgeDetails;
    public stockWithSerialNumber = new Array<StockDetail>();
    public stockWithMaterialCode = new Array<StockDetail>();
    public summaryDetail = new Array<SummaryDetail>();
    public searchFilterList: SearchFilterSerialNumberList[] = []
    public unmatchedList: string[] = []
    public selectedCount = 0;
    public selectAll = true;
    public allText = 'Select All';
    public remark = '';
    public isDispatched = false;


    public pageNumberWithSerial = 0;
    public pageNumberWithSAPCode = 0;
    public pageNumberSummary = 0;
    public searchResultList = new Array<{ serial_number: string }>();

    public inputSerialOrCode: string = '';
    public Remarks = '';
    public summaryRequest?: AcknowlegeSaveRequest;
    public enableAcknowledge = false;
    tempData: AcknowledgeDetails = TEMP_ACKNOWLEDGE_DATA;

    constructor(
        private bcSearchStockService: BcSearchStockService,
        private toastService: ToastService,
        private store: Store<State>,
        private getStore: Store<{ Inventory: InventoryState }>
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.getAcknowledgeDetails(this.requestId);
        this.displayDispatchedSerials();
    }

    private initForm(): void {
        this.acknowledgeForm = new FormGroup({
            typeOf: new FormControl(this.transferItemTypes[0], { validators: [Validators.required] }),
            typeDetail: new FormControl(null, { validators: [] }),
        });
        this.acknowledgeForm.controls.typeDetail.disable;
    }

    displayDispatchedSerials() {
      
        this.itemRow.serial_numbers.forEach(element => {
            const searchFilterItem: SearchFilterSerialNumberList = {
                serial: '',
                selected: false,
                newlyAdded: false
            }
            searchFilterItem.serial = element;
            if (this.itemRow.isVerified) {
                searchFilterItem.selected = true;
            } else {
                searchFilterItem.selected = false;
            }
            this.searchFilterList.push(searchFilterItem);
        });
        this.selectedCount = this.searchFilterList.filter(x => x.selected).length;
        this.checkAllSelected();
    }
    onConfirmClick() {
         if(this.selectedCount < Number(this.itemRow.approved_quantity)){
            this.toastService.show('Error', 'You have selected less serials than approved quantity, Please uncheck to match quantity');
        }
         else {
            const serials: Array<string> = []
            this.searchFilterList.filter(x => x.selected).forEach(element => {
                serials.push(element.serial)
            });

            this.store.dispatch(InventoryStoreDetails.setAcknowledgeSerielNumbers(
                { sapCode: this.itemRow.sap_material_code, isVerified:true, serialList: serials }));
            this.summaryClick.emit();
        }
    }
    onAddAcknowledge() {

    }

    onSelectType(value: string) {
        if (value == this.transferItemTypes[0]) {
            this.acknowledgeForm.controls.typeDetail.disable;
        }
    }
    onAckowledgeClick() {
        const list_of_item_details_request = new Array<AcknowledgeSaveItemType>();
        this.stockWithMaterialCode.forEach(item => {
            list_of_item_details_request.push(
                {
                    approved_quantity: item.approved_quantity,
                    item_name: item.item_name,
                    received_quantity: item.received_quantity + '',
                    requested_quantity: this.acknowledgeResponse?.summary_details.filter(p => p.sap_material_code == item.sap_material_code)[0].requested_quantity + '',
                    sap_material_code: item.sap_material_code,
                    sequence: null,
                    serial_no_list: [],
                    transfer_quantity: item.transfer_quantity
                }
            )
        })
        const SAPCodeListINstockWithSerialNumber = [...new Set(this.stockWithSerialNumber.filter(i => i.checked).map(s => { return s.sap_material_code }))];
        SAPCodeListINstockWithSerialNumber.forEach(item => {
            var selectedSerialzedItem = this.stockWithSerialNumber.filter(s => s.sap_material_code == item);
            if (selectedSerialzedItem[0].checked) {
                let selectedSerials = selectedSerialzedItem.filter(i => i.checked).map(si => { return si.serial_number });
                list_of_item_details_request.push(
                    {
                        approved_quantity: selectedSerials.length + '',
                        item_name: selectedSerialzedItem[0].item_name,
                        received_quantity: selectedSerialzedItem.map(si => { return si.serial_number }).length + '',
                        requested_quantity: this.acknowledgeResponse?.summary_details.filter(p => p.sap_material_code == selectedSerialzedItem[0].sap_material_code)[0].requested_quantity + '',
                        sap_material_code: selectedSerialzedItem[0].sap_material_code,
                        sequence: null,
                        serial_no_list: selectedSerials,
                        transfer_quantity: selectedSerials.length + ''
                    }
                );
            }
        })
        this.summaryRequest = {
            approval_user: this.acknowledgeResponse?.approved_user,
            approved_at: this.acknowledgeResponse?.approved_date,
            destination_outlet: this.acknowledgeResponse?.destination_outlet_store_id,
            list_of_item_details_request: list_of_item_details_request,
            origin_outlet: this.acknowledgeResponse?.origin_outlet_store_id,
            remark: this.Remarks,
            serial: this.acknowledgeResponse?.serial_product || this.stockWithSerialNumber.length > 0,
            ship_user: '',
            transferred_at: this.acknowledgeResponse?.transfer_date,
            transferred_by: this.acknowledgeResponse?.transfer_user
        };
        this.bcSearchStockService.transferAckowledge(this.requestId, this.summaryRequest, this.isBC_BC ? 'BC' : 'WH').subscribe(res => {
            if (res) {
                this.toastService.show('Acknowledge Successfully Created.', '');
                this.viewSummary = true;
                this.onviewAcknowledgeSummaryClick.emit(true);
            }
        }, (error) => {
            this.toastService.show('Error', error.error.errorMessage)
        })

    }

    private getAcknowledgeDetails(requestId: string) {
        this.bcSearchStockService.getAckowledgeDetails(requestId).subscribe(
            response => {
                if (response) {
                    this.acknowledgeResponse = response;
                    this.summaryDetail = response.summary_details;
                    this.summaryDetail.forEach(s => s.approved_quantity = 0);
                    this.stockWithSerialNumber = this.acknowledgeResponse.stock_details.filter(details => details.serial_number);
                    this.stockWithMaterialCode = this.acknowledgeResponse.stock_details.filter(details => !details.serial_number);
                    if (this.stockWithSerialNumber.length > 0) {
                        this.acknowledgeForm.controls.typeOf.setValue(this.transferItemTypes[0]);
                    } else {
                        this.acknowledgeForm.controls.typeOf.setValue(this.transferItemTypes[1])
                    }
                }
            }, (error) => {
                this.toastService.show('Error', error.error.errorMessage);
            },
        );
        //this.acknowledgeResponse = this.tempData;
        // this.stockWithSerialNumber = this.acknowledgeResponse.stock_details.filter(details => details.serial_number);
        //this.stockWithMaterialCode = this.acknowledgeResponse.stock_details.filter(details => details.sap_material_code);

    }

    searchFromTable() {
        if (this.inputSerialOrCode == '' || this.inputSerialOrCode == null) {
            this.toastService.show('Error', 'Please enter serial number.');
            return;
        }
        if (this.stockWithSerialNumber.length > 0 && this.stockWithSerialNumber.filter(i => i.checked).length === this.stockWithSerialNumber.length) {
            this.toastService.show('Error', 'Approved quantity of this SAP material code already added.');
            return;
        }
        if (this.acknowledgeForm.controls.typeOf.value == 'Serial Number') {
            let selectedItem: StockDetail;
            for (let i = 0; i < this.stockWithSerialNumber.length; i++) {
                if (this.stockWithSerialNumber[i].serial_number == this.inputSerialOrCode) {
                    if (this.stockWithSerialNumber[i].approved_quantity == '0' || this.stockWithSerialNumber[i].requested_quantity == '0') {
                        this.toastService.show('Error', 'No requested/approved quantity from the SAP material code');
                        return;
                    }
                    if (this.stockWithSerialNumber[i].checked) {
                        this.toastService.show('Error', 'This serial number has already been acknowledged');
                        return;
                    }
                    this.stockWithSerialNumber[i].checked = true;
                    selectedItem = this.stockWithSerialNumber[i];
                    this.summaryDetail.forEach(s => {
                        if (s.sap_material_code == this.stockWithSerialNumber[i].sap_material_code) {
                            s.approved_quantity++;
                        }
                    });
                    this.stockWithSerialNumber.splice(i, 1);
                    this.stockWithSerialNumber.unshift(selectedItem);
                    this.inputSerialOrCode = '';

                    this.checkAcknowledgeButtonEnable();
                    return;
                }
            }
            let item: UnmatchedItems = {
                itemCode: this.inputSerialOrCode,
                label: 'Serial Number',
            };
            this.unmatchedItems.push(item);
            this.inputSerialOrCode = '';
        }
        if (this.acknowledgeForm.controls.typeOf.value == 'SAP Material code') {
            let selectedItem: StockDetail;
            for (let i = 0; i < this.stockWithMaterialCode.length; i++) {
                if (this.stockWithMaterialCode[i].sap_material_code == this.inputSerialOrCode) {
                    this.stockWithMaterialCode[i].checked = true;
                    selectedItem = this.stockWithMaterialCode[i];
                    this.stockWithMaterialCode.splice(i, 1);
                    this.stockWithMaterialCode.unshift(selectedItem);
                    this.inputSerialOrCode = '';
                    return;
                }
            }
            let item: UnmatchedItems = {
                itemCode: this.inputSerialOrCode,
                label: 'SAP Material code',
            };
            this.unmatchedItems.push(item);
            this.inputSerialOrCode = '';
        }
    }

    searchSerialsForAcknowledge() {
        if (this.inputSerialOrCode == '' || this.inputSerialOrCode == null) {
            this.toastService.show('Error', 'Please enter serial number.');
        } else {
            this.searchFilterList.forEach(element => {
                if (element.serial == this.inputSerialOrCode) {
                    element.selected = true;
                    element.newlyAdded = true;
                } else {
                    this.unmatchedList.push(this.inputSerialOrCode);
                }
            });
            this.searchFilterList.sort((a, b) => (a.selected === b.selected) ? 0 : a.selected ? -1 : 1);
            this.searchFilterList.sort((a, b) => (a.newlyAdded === b.newlyAdded) ? 0 : a.newlyAdded ? -1 : 1);
            this.selectedCount = this.searchFilterList.filter(x => x.selected).length;
            this.checkAllSelected();
        }

    }
    checkboxClick(item: SearchFilterSerialNumberList) {
        this.searchFilterList.forEach(element => {
            element.newlyAdded = false;
            if (element == item) {
                element.selected = !element.selected;
            }
        });
        // this.searchFilterList.sort((a, b) => (a.selected === b.selected) ? 0 : a.selected ? -1 : 1);
        // this.searchFilterList.sort((a, b) => (a.newlyAdded === b.newlyAdded) ? 0 : a.newlyAdded ? -1 : 1);
        this.selectedCount = this.searchFilterList.filter(x => x.selected).length;
        this.checkAllSelected();
        // setTimeout(() => {
        //     this.searchFilterList.forEach(element => {
        //         element.newlyAdded = false;
        //     });
        //   }, 1000); // 3000 ms = 3 seconds
    }
    checkAllSelected() {
        if (this.selectedCount < Number(this.itemRow.serial_numbers.length)) {
            this.selectAll = true;
            this.allText = 'Select All';
        } else {
            this.selectAll = false;
            this.allText = 'Remove All';
        }
    }
    selectRemoveAll() {
        this.selectAll = !this.selectAll;
        if (this.selectAll) {
            this.allText = 'Select All';
            this.searchFilterList.forEach(element => {
                element.selected = false;
                element.newlyAdded = false;
            });
        } else {
            this.allText = 'Remove All';
            this.searchFilterList.forEach(element => {
                element.selected = true;
                element.newlyAdded = true;
            });
        }
        this.searchFilterList.sort((a, b) => (a.selected === b.selected) ? 0 : a.selected ? -1 : 1);
        this.searchFilterList.sort((a, b) => (a.newlyAdded === b.newlyAdded) ? 0 : a.newlyAdded ? -1 : 1);
        this.selectedCount = this.searchFilterList.filter(x => x.selected).length;

        setTimeout(() => {
            this.searchFilterList.forEach(element => {
                element.newlyAdded = false;
            });
        }, 1000); // 3000 ms = 3 seconds
    }
    onTableDataChange(value: number, SAPcode: string) {
        this.summaryDetail.forEach(s => {
            if (s.sap_material_code == SAPcode) {
                s.approved_quantity = value;
            }
        });
        this.checkAcknowledgeButtonEnable();
    }
    checkAcknowledgeButtonEnable() {
        var unMatchedItems = new Array();
        this.summaryDetail.forEach(i => {
            if (parseInt(i.transfer_quantity) != i.approved_quantity) {
                unMatchedItems.push(i);
            }
        })
        this.enableAcknowledge = unMatchedItems.length == 0;
    }

}
