import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    BcViewStockTransferDetailsBcToBc,
    SearchFilterSerialNumberList,
    SearchSerialNumberRequest,
    StockTransferItemDetails,
    StockTransferItemList,
    StockTransferSerialRequest,
} from '@app/SW-layout/inventory/models/bc-view-stock-transfer-details-bc-to-bc';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { State } from '@app/SW-layout/inventory/state/app-state';
import { InventoryState } from '@app/SW-layout/inventory/state/inventory-data-reducer';
import { ToastService } from '@common/services';
import { Store } from '@ngrx/store';
import { StorageSettings } from 'constants/StorageSettings';
import { LocalStorageService } from 'services/local-storage.service';

import * as InventoryStoreDetails from './../../../state/inventory-data-action';
import { BcSearchStockService } from '@app/SW-layout/inventory/services/bc-search-stock.service';

@Component({
    selector: 'SW-bc-transfer-stock-to-destination-bc-and-view-summary',
    templateUrl: './bc-transfer-stock-to-destination-bc-and-view-summary.component.html',
    styleUrls: ['./bc-transfer-stock-to-destination-bc-and-view-summary.component.scss']
})
export class BcTransferStockToDestinationBcAndViewSummaryComponent implements OnInit {

    @Input() storeId = '';
    @Input() requestId = '';
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
    @Output() backClick = new EventEmitter<boolean>();
    @Output() doneClick = new EventEmitter<boolean>();
    @Output() summaryClick = new EventEmitter<boolean>();

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
    public summaryList = new Array<StockTransferItemDetails>();
    public searchResultList = new Array<{ serial_number: string }>();
    public searchFilterList: SearchFilterSerialNumberList[] = []
    public addedStockList = new Array<{ serial_number: string }>();

    public selectedStockToBeAdded = '';
    public selectedStockToBeRemoved = '';

    public selectedOutletAddress = '';
    public advancedSearch = false;
    public selectedCount = 0;
    public searchedSerial = '';
    public searchedFromSerial = '';
    public searchedToSerial = '';
    public isDispatched = false;
    public selectAll = true;
    public allText = 'Select All';

    private searchRequest: SearchSerialNumberRequest = {
        from_serial: '',
        sap_code: '',
        store_id: '',
        to_serial: ''
    };

    public searchForm = new FormGroup({});

    constructor(
        private toastService: ToastService,
        private bcViewStockService: BcViewStockService,
        private bcSearchStockService: BcSearchStockService,
        private localStorageService: LocalStorageService,
        private store: Store<State>,
        private getStore: Store<{ Inventory: InventoryState }>
    ) {
    }

    ngOnInit(): void {
        this.getPageLoadData();
        this.getStoreData();
        if(this.isDispatched){
            this.displayDispatchedSerials()
        }else{
            this.searchSerialsForSelectedItem();
        }
      
    }

    getStoreData() {
        this.getStore.select('Inventory').subscribe((data) => {
            this.stockTransferDetailsFromStore = data.stockTransferDetail;
            if( this.stockTransferDetailsFromStore.status.toUpperCase() == 'DISPATCHED'
             || this.stockTransferDetailsFromStore.status.toUpperCase() == 'RECEIVED'
             || this.stockTransferDetailsFromStore.status.toUpperCase() == 'CLOSED'){
                this.isDispatched = true;
                console.log(this.stockTransferDetailsFromStore.status.toUpperCase())
            }
        });
    }

    displayDispatchedSerials(){
       
        this.itemRow.serial_numbers.forEach(element => {
            const searchFilterItem: SearchFilterSerialNumberList = {
                serial: '',
                selected: false,
                newlyAdded:false
            }
            searchFilterItem.serial = element;
            searchFilterItem.selected = false;
            this.searchFilterList.push(searchFilterItem);
        });
    }

    searchSerialsForSelectedItem() {
        let count = 0;
        this.searchRequest.sap_code = this.itemRow.sap_material_code;
        this.searchRequest.store_id = this.storeId
        this.bcViewStockService.searchSerialNumbers(this.searchRequest).subscribe(response => {
            this.searchResultList = response ?? [];
            this.searchResultList.forEach(element => {
                const searchFilterItem: SearchFilterSerialNumberList = {
                    serial: '',
                    selected: false,
                    newlyAdded:false,
                }
                searchFilterItem.serial = element.serial_number;
                const itemList  = this.stockTransferDetailsFromStore.item_details
                .filter(x => x.sap_material_code == this.itemRow.sap_material_code)[0]
                if(itemList.isVerified){
                    itemList.added_serial_numbers.forEach(element => {
                        if (element === searchFilterItem.serial) {
                            searchFilterItem.selected = true;
                        }
                    });
                    this.searchFilterList.push(searchFilterItem);
                }else{
                    count++
                    if (count <= Number(this.itemRow.approved_quantity)) {
                        searchFilterItem.selected = true;
                        this.selectedCount++;
                    } else {
                        searchFilterItem.selected = false;
                    }
                    this.searchFilterList.push(searchFilterItem);
                }
                this.searchFilterList.sort((a, b) => (a.selected === b.selected) ? 0 : a.selected ? -1 : 1);
                this.selectedCount = this.searchFilterList.filter(x => x.selected).length;
                this.checkAllSelected();
            });
        }, (error) => {
            if (error.error.code === 500) {
                this.toastService.show('Unable to load data', '');
            } else {
                this.toastService.show(error.error.errorMessage || 'Unable to load data', '');
            }
        });
    }

    searchSerialClick() {
        if (this.advancedSearch) {
            if (this.searchedFromSerial == '' || this.searchedToSerial == '') {
                this.toastService.show('Error', 'Please fill serial range');
            } else if (!this.searchedFromSerial.match(/^[0-9]*$/) || !this.searchedToSerial.match(/^[0-9]*$/)) {
                this.toastService.show('Error', 'Please enter valid serial');
            } else if (this.searchedFromSerial >= this.searchedToSerial) {
                this.toastService.show('Error', 'From Serial should be less than To Serial');
            } else {
                const range = (start: number, end: number) => Array.from(Array(end - start + 1).keys()).map(x => x + start);
                const serialArray = range(Number(this.searchedFromSerial), Number(this.searchedToSerial));
                this.searchFilterList.forEach(element => {
                    if (serialArray.includes(Number(element.serial))) {
                        element.selected = true;
                        element.newlyAdded = true;
                    }
                });
                this.searchFilterList.sort((a, b) => (a.selected === b.selected) ? 0 : a.selected ? -1 : 1);
                this.searchFilterList.sort((a, b) => (a.newlyAdded === b.newlyAdded) ? 0 : a.newlyAdded ? -1 : 1);
                this.selectedCount = this.searchFilterList.filter(x => x.selected).length;
                this.checkAllSelected();

                setTimeout(() => {
                    this.searchFilterList.forEach(element => {
                        element.newlyAdded = false;
                    });
                  }, 1000); // 3000 ms = 3 seconds
            }

        } else if (this.searchedSerial !== '') {
            this.searchFilterList.forEach(element => {
                if (element.serial == this.searchedSerial) {
                    element.selected = true;
                    element.newlyAdded = true;
                }
            });
            this.searchFilterList.sort((a, b) => (a.selected === b.selected) ? 0 : a.selected ? -1 : 1);
            this.searchFilterList.sort((a, b) => (a.newlyAdded === b.newlyAdded) ? 0 : a.newlyAdded ? -1 : 1);
            this.selectedCount = this.searchFilterList.filter(x => x.selected).length;
            this.checkAllSelected();

            setTimeout(() => {
                this.searchFilterList.forEach(element => {
                    element.newlyAdded = false;
                });
              }, 1000); // 3000 ms = 3 seconds
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

    selectRemoveAll(){
        this.selectAll = !this.selectAll;
        if(this.selectAll){
            this.allText = 'Select All';
            this.searchFilterList.forEach(element => {
                element.selected = false;
                element.newlyAdded = false;
            });
        }else{
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

    checkAllSelected(){
        if(this.selectedCount < Number(this.searchResultList.length)){
            this.selectAll = true;
            this.allText = 'Select All';
        }else{
            this.selectAll = false;
            this.allText = 'Remove All';
        }
    }

    onConfirmClick() {
        if (this.selectedCount > Number(this.itemRow.approved_quantity)) {
            this.toastService.show('Error', 'You have selected more serials than approved quantity, Please uncheck to match quantity');
        }else if(this.selectedCount < Number(this.itemRow.approved_quantity)){
            this.toastService.show('Error', 'You have selected less serials than approved quantity, Please uncheck to match quantity');
        }
         else {
            const serials: Array<string> = []
            this.searchFilterList.filter(x => x.selected).forEach(element => {
                serials.push(element.serial)
            });

            this.store.dispatch(InventoryStoreDetails.setstockSerielNumbers(
                { sapCode: this.itemRow.sap_material_code, isVerified:true, serialList: serials }));
            this.summaryClick.emit();
        }
    }

    onSearchProducts(): void {
        if (this.searchForm.invalid) {
            this.searchForm.markAllAsTouched();
            this.toastService.show('Fill all mandatory fields', '');
            return;
        }

        var isfromSerialNumeric = this.searchForm.value.serialNumberFrom?.match(/^[0-9]+$/) !== null;
        var istoSerialNumeric = this.searchForm.value.serialNumberTo?.match(/^[0-9]+$/) !== null;
        if ((!isfromSerialNumeric && istoSerialNumeric) || (isfromSerialNumeric && !istoSerialNumeric)) {
            this.toastService.show('invalid Serial Range', '');
            return;
        }
        if ((this.searchForm.value.serialNumberFrom && !this.searchForm.value.serialNumberTo) || (this.searchForm.value.serialNumberFrom && this.searchForm.value.serialNumberTo == '')) {
            this.toastService.show('invalid Serial Range', '');
            return;
        }
        if ((this.searchForm.value.serialNumberTo && !this.searchForm.value.serialNumberFrom) || (this.searchForm.value.serialNumberTo && this.searchForm.value.serialNumberFrom == '')) {
            this.toastService.show('invalid Serial Range', '');
            return;
        }
        if (!this.summaryList.find(stock => stock.sap_material_code === this.searchForm.value.sapMaterialCode?.trim())) {
            this.toastService.show('Item from this SAP material code not requested', '');
            return;
        }
        this.searchRequest = {
            from_serial: this.searchForm.value.serialNumberFrom,
            to_serial: this.searchForm.value.serialNumberTo,
            store_id: this.storeId,
            sap_code: this.searchForm.value.sapMaterialCode
        };
        this.retrieveSearchResults(this.searchRequest);
    }

    onSearchedListItemClick(selectedSerialNumber: string): void {
        this.selectedStockToBeAdded = selectedSerialNumber;
    }

    onAddStockClick(): void {
        const stockIndexToBeAdded = this.searchResultList.findIndex(stock => stock.serial_number === this.selectedStockToBeAdded);
        const stockToBeAdded = this.searchResultList[stockIndexToBeAdded];

        const relevantStockItemIndex = this.summaryList.findIndex(item => item.sap_material_code === this.searchRequest?.sap_code);

        if (stockToBeAdded) {
            this.addedStockList.unshift(stockToBeAdded);
            this.searchResultList.splice(stockIndexToBeAdded, 1);

            this.summaryList[relevantStockItemIndex].added_serial_numbers?.push(stockToBeAdded.serial_number);
            this.summaryList[relevantStockItemIndex].transfer_quantity =
                (+this.summaryList[relevantStockItemIndex].transfer_quantity + 1).toString();
            this.selectedStockToBeAdded = '';
        }
    }

    onAddedListItemClick(selectedSerialNumber: string): void {
        this.selectedStockToBeRemoved = selectedSerialNumber;
    }

    onRemoveStockClick(): void {
        const indexToBeRemoved = this.addedStockList.findIndex(stock => stock.serial_number === this.selectedStockToBeRemoved);
        const itemToBeRemoved = this.addedStockList[indexToBeRemoved];

        const relevantStockItemIndex = this.summaryList.findIndex(item => item.sap_material_code === this.searchRequest?.sap_code);

        if (indexToBeRemoved >= 0) {
            this.addedStockList.splice(this.addedStockList.findIndex(stock => stock.serial_number === this.selectedStockToBeRemoved), 1);
            this.searchResultList.push(itemToBeRemoved);

            this.summaryList[relevantStockItemIndex].added_serial_numbers?.splice(indexToBeRemoved, 1);
            this.summaryList[relevantStockItemIndex].transfer_quantity =
                (+this.summaryList[relevantStockItemIndex].transfer_quantity - 1).toString();
            this.selectedStockToBeRemoved = '';
        }
    }

    onDoneClick(): void {
        if (this.stockTransferDetails?.serial_product && this.summaryList.filter(item => item.transfer_quantity !== item.approved_quantity)?.length > 0) {
            this.toastService.show('Transfer quantity should be equal to approved quantity', '');
            return;
        }
        this.bcViewStockService.saveStockTransferSerialNumbers(this.setSaveRequest(), this.requestId).subscribe(response => {
            if (response.status) {
                this.doneClick.emit(true);
            }
        }, () => {
            this.toastService.show('Unable to transfer', '');
        });
    }

    private initializeForm(): void {
        this.searchForm = new FormGroup({
            sapMaterialCode: new FormControl(null, { validators: [Validators.required, Validators.maxLength(100)] }),
            serialNumberFrom: new FormControl(null, { validators: [Validators.maxLength(100)] }),
            serialNumberTo: new FormControl(null, { validators: [Validators.maxLength(100)] }),
        });
    }

    private getPageLoadData(): void {
        this.bcViewStockService.getStockTransferDetails(this.requestId).subscribe(res => {
            this.stockTransferDetails = res;
            // this.summaryList = res?.item_details?.map(item => {
            //     return {
            //         ...item,
            //         approved_quantity: !item.approved_quantity ? '0' : item.approved_quantity,
            //         transfer_quantity: '0',
            //         added_serial_numbers: []
            //     }
            // }) || [];
            // this.getAddressByOutlet(this.stockTransferDetails?.destination_outlet_store_id);
        });
    }

    private retrieveSearchResults(searchRequest: SearchSerialNumberRequest): void {
        this.bcViewStockService.searchSerialNumbers(searchRequest).subscribe(response => {
            if (!response || response.length == 0) {
                this.toastService.show('Serial Number Not Found', '');
                return;
            }
            this.searchResultList = new Array<{ serial_number: string }>();
            this.addedStockList = new Array<{ serial_number: string }>();
            this.searchResultList = response ?? [];

            // check whether serial number is already added, and then filter them from the search results
            const relevantStockItem = this.summaryList.find(item => item.sap_material_code === this.searchRequest?.sap_code);
            if (!relevantStockItem?.added_serial_numbers?.length) {
                return;
            }
            for (const serial of relevantStockItem.added_serial_numbers) {
                this.addedStockList.push({ serial_number: serial });
            }
            this.searchResultList = this.searchResultList.filter((el) => {
                return !this.addedStockList.find((f) => {
                    return f.serial_number === el.serial_number;
                });
            });
        }, (error) => {
            if (error.error.code === 500) {
                this.toastService.show('Unable to load data', '');
            } else {
                this.toastService.show(error.error.errorMessage || 'Unable to load data', '');
            }
        });
    }

    private setSaveRequest(): StockTransferSerialRequest {
        return {
            approval_user: this.stockTransferDetails?.approved_user ?? '',
            approved_date: this.stockTransferDetails?.approved_date ?? '',
            login_user: this.localStorageService.get(StorageSettings.LOGIN_NAME),
            list_of_items: this.summaryList.map<StockTransferItemList>(item => {
                return {
                    approved_quantity: +item.approved_quantity,
                    item_name: item.item_name,
                    request_quantity: +item.requested_quantity,
                    sap_material_code: item.sap_material_code,
                    serial_number_list: item.added_serial_numbers ?? [],
                    transfer_quantity: this.stockTransferDetails?.serial_product === false ?
                        +item.approved_quantity : +item.transfer_quantity
                }
            }),
            transfer_from_store_id: this.stockTransferDetails?.origin_outlet_store_id ?? '',
            transfer_to_store_id: this.stockTransferDetails?.destination_outlet_store_id ?? ''
        }
    }

    private getAddressByOutlet(outletId: string): void {
        this.bcViewStockService.getMainAddress(outletId).subscribe(response => {
            this.selectedOutletAddress = response?.main_address ?? '';
        })
    }

    toggleAS() {
        this.advancedSearch = !this.advancedSearch
        this.searchedFromSerial = '';
        this.searchedToSerial = '';
        this.searchedSerial = '';
    }

    onDownloadClick(){
        this.bcSearchStockService.bcStockRequestSummary(this.stockTransferDetails.destination_outlet_store_id,this.requestId,this.itemRow.sap_material_code)
        .subscribe(response => {
            const file = new Blob([response.body as BlobPart], { type: 'data:application/vnd.ms-excel' });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = fileURL;
            a.download = 'StockTransferSummary.xls';
            a.click();
            document.body.removeChild(a);
        }, (error) => {
            this.toastService.show('Unable to download', 'Unable to download the Excel file.');
        });
    }

}
