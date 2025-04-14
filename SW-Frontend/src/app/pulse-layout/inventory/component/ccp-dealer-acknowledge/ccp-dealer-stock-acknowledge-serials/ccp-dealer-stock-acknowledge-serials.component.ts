import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TEMP_ACKNOWLEDGE_DATA } from '@app/SW-layout/dashboard/data/data';
import { AcknowledgeDetails, AcknowledgeSaveItemType, AcknowlegeSaveRequest, StockDetail, SummaryDetail, UnmatchedItems } from '@app/SW-layout/inventory/models/bc-ackowledge-details';
import { SearchFilterSerialNumberList, StockTransferItemDetails } from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { BcSearchStockService } from '@app/SW-layout/inventory/services/bc-search-stock.service';
import { State } from '@app/SW-layout/inventory/state/app-state';
import { InventoryState } from '@app/SW-layout/inventory/state/inventory-data-reducer';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import * as InventoryStoreDetails from './../../../state/inventory-data-action';


@Component({
    selector: 'SW-ccp-dealer-stock-acknowledge-serials',
    templateUrl: './ccp-dealer-stock-acknowledge-serials.component.html',
    styleUrls: ['./ccp-dealer-stock-acknowledge-serials.component.scss']
})
export class CcpDealerStockAcknowledgeSerialsComponent implements OnInit {

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
    public allText = 'Scan All';
    public remark = '';
    public isDispatched = false;
    public unmatchedString = '';

    public pageNumberWithSerial = 0;
    public pageNumberWithSAPCode = 0;
    public pageNumberSummary = 0;
    public searchResultList = new Array<{ serial_number: string }>();

    public inputSerialOrCode: string = '';
    public Remarks = '';
    public summaryRequest?: AcknowlegeSaveRequest;
    public enableAcknowledge = false;
    tempData: AcknowledgeDetails = TEMP_ACKNOWLEDGE_DATA;
    public unmatchedSerialModalRef?: NgbModalRef;
    public incompleteSerialModalRef?: NgbModalRef;
    @ViewChild('modalUnmatchSerial', { static: true }) unmatchPopup!: TemplateRef<any>;
    @ViewChild('modalIncompleteSerial', { static: true }) incompletePopup!: TemplateRef<any>;
    @ViewChild('modalSelectAll', { static: true }) selectAllPopup!: TemplateRef<any>;
    @ViewChild('modalScanner', { static: true }) scannerPopup!: TemplateRef<any>;

    constructor(
        private bcSearchStockService: BcSearchStockService,
        private toastService: ToastService,
        private store: Store<State>,
        private modalService: NgbModal,) {
    }

    ngOnInit(): void {
        this.initForm();
        //   this.getAcknowledgeDetails(this.requestId);
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
        if (this.selectedCount < Number(this.itemRow.approved_quantity)) {
            this.unmatchedString = this.searchFilterList.reduce((acc: string, item: SearchFilterSerialNumberList) => {
                if (!item.selected) {
                    return acc.concat(item.serial + ',');
                }
                return acc;
            }, '');
            this.modalService.open(this.incompletePopup, { centered: true, size: 'md' });
        }
        else {
            const serials: Array<string> = []
            this.searchFilterList.filter(x => x.selected).forEach(element => {
                serials.push(element.serial)
            });

            this.store.dispatch(InventoryStoreDetails.setAcknowledgeSerielNumbers(
                { sapCode: this.itemRow.sap_material_code, isVerified: true, serialList: serials }));
            this.summaryClick.emit();
        }
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

    //   private getAcknowledgeDetails(requestId: string) {
    //       this.bcSearchStockService.getAckowledgeDetails(requestId).subscribe(
    //           response => {
    //               if (response) {
    //                   this.acknowledgeResponse = response;
    //                   this.summaryDetail = response.summary_details;
    //                   this.summaryDetail.forEach(s => s.approved_quantity = 0);
    //                   this.stockWithSerialNumber = this.acknowledgeResponse.stock_details.filter(details => details.serial_number);
    //                   this.stockWithMaterialCode = this.acknowledgeResponse.stock_details.filter(details => !details.serial_number);
    //                   if (this.stockWithSerialNumber.length > 0) {
    //                       this.acknowledgeForm.controls.typeOf.setValue(this.transferItemTypes[0]);
    //                   } else {
    //                       this.acknowledgeForm.controls.typeOf.setValue(this.transferItemTypes[1])
    //                   }
    //               }
    //           }, (error) => {
    //               this.toastService.show('Error', error.error.errorMessage);
    //           },
    //       );
    //       //this.acknowledgeResponse = this.tempData;
    //       // this.stockWithSerialNumber = this.acknowledgeResponse.stock_details.filter(details => details.serial_number);
    //       //this.stockWithMaterialCode = this.acknowledgeResponse.stock_details.filter(details => details.sap_material_code);

    //   }

    searchSerialsForAcknowledge() {
        if (this.inputSerialOrCode == '' || this.inputSerialOrCode == null) {
            this.toastService.show('Error', 'Please enter serial number.');
        } else {
            let count = 0;
            this.searchFilterList.forEach(element => {

                if (element.serial == this.inputSerialOrCode) {
                    element.selected = true;
                    element.newlyAdded = true;
                    count++
                }
            });
            if (count === 0) {
                this.modalService.open(this.unmatchPopup, { centered: true, size: 'md' });
            }

            // this.inputSerialOrCode = '';
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
            this.allText = 'Scan All';
        } else {
            this.selectAll = false;
            this.allText = 'Remove All';
        }
    }
    selectRemoveAll() {

        this.selectAll = !this.selectAll;
        if (this.selectAll) {
            this.allText = 'Scan All';
            this.searchFilterList.forEach(element => {
                element.selected = false;
                element.newlyAdded = false;
            });
        } else {
            this.modalService.open(this.selectAllPopup, { centered: true, size: 'md' });
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

    confirmSelectAll() {
        this.modalService.dismissAll();
        this.allText = 'Remove All';
        this.searchFilterList.forEach(element => {
            element.selected = true;
            element.newlyAdded = true;
        });
        this.selectedCount = this.searchFilterList.filter(x => x.selected).length;
        this.checkAllSelected();
    }

    onScanClick() {
        this.modalService.open(this.scannerPopup, { centered: true, size: 'md' });
    }

    confirmScan() {

    }

}
