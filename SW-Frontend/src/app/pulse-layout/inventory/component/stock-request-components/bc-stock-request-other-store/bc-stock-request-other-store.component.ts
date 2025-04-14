import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmStocks, TransferItemList } from '@app/SW-layout/inventory/models/bc-stock-request-other-store';
import {
    BCStock,
    BCStockSearchRequest,
    ProductBrand,
    ProductCategory,
} from '@app/SW-layout/inventory/models/bc-view-stock';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { ToastService } from '@common/services';
import { StorageSettings } from 'constants/StorageSettings';
import { Outlets } from 'models/login-details';
import { LocalStorageService } from 'services/local-storage.service';

@Component({
    selector: 'SW-bc-stock-request-other-store',
    templateUrl: './bc-stock-request-other-store.component.html',
    styleUrls: ['./bc-stock-request-other-store.component.scss']
})
export class BcStockRequestOtherStoreComponent implements OnInit {

    @Output() confirmClick = new EventEmitter<string>();

    public productCategoryList = new Array<ProductCategory>();
    public productBrandList = new Array<ProductBrand>();
    public outletList = new Array<Outlets>();
    public outletListByRegion = new Array<Outlets>();

    public ownStoreSearchForm = new FormGroup({});

    public pageNumber = 1;
    public pageNumber2 = 1;

    public bcSearchRequest!: BCStockSearchRequest;
    public selectedStock: BCStock | null = null;
    public stockResults = new Array<BCStock>();
    public addedStockList = new Array<BCStock>();

    public productType?: 'SERIAL' | 'NON_SERIAL';

    public errorMessage = 'It seems like there’s an issue getting the data.';
    public selectedOutletAddress = '';
    public selectedStoreId = '';

    constructor(
        private toastService: ToastService,
        private bcViewStockService: BcViewStockService,
        private localStorageService: LocalStorageService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.retrieveOutletListByRegion((this.localStorageService.getOutlets() as Array<Outlets>)?.[0].region);
        this.retrieveProductCategoryList(6);

        this.ownStoreSearchForm.controls.radio.valueChanges.subscribe(
            value => {
                if (value === 'reload') {
                    this.retrieveProductCategoryList(6);
                    this.outletList = this.outletListByRegion;
                    this.outletList = this.outletList
                        .filter(outlet => outlet.outlet_id !== (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id);
                    this.ownStoreSearchForm.controls.storeID.patchValue(this.outletList?.[0].outlet_id);
                } else if (value === 'device') {
                    this.retrieveProductCategoryList(5);
                    this.bcViewStockService.getOutletListByOutletType('BC').subscribe(
                        response => {
                            this.outletList = response ?? [];
                            this.outletList = this.outletList.filter(
                                outlet => outlet.outlet_id !== (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id
                            );
                            this.ownStoreSearchForm.controls.storeID.patchValue(this.outletList?.[0].outlet_id);
                        }
                    );
                }
            }
        );
    }

    onSelectProductCategory(value: string): void {
        this.ownStoreSearchForm.controls.brand.patchValue(null);
        this.retrieveProductBrandsByCategory(value);
    }

    onSearchOwnStore(): void {
        if (this.ownStoreSearchForm.invalid) {
            this.ownStoreSearchForm.markAllAsTouched();
            return;
        }
        this.bcSearchRequest = {
            brand: this.ownStoreSearchForm.value.brand,
            category: this.ownStoreSearchForm.value.productCategory,
            item_name: this.ownStoreSearchForm.value.itemName,
            material_code: this.ownStoreSearchForm.value.materialCode,
            store_id: this.ownStoreSearchForm.value.storeID,
        }
        if(this.ownStoreSearchForm.value.storeID != undefined){
            this.selectedStoreId = this.bcSearchRequest.store_id;
        }else{
            this.bcSearchRequest.store_id = this.selectedStoreId;
        }
        this.retrieveSearchResults();
    }

    onAddButtonClick(row: BCStock): void {
        this.pageNumber2 = 1
        if (!row.tempInputQuantity || row.tempInputQuantity === '0') {
            this.toastService.show('Invalid quantity', '');
            return;
        }
        if (!row.tempInputQuantity.match(/^[0-9]*$/)) {
            this.toastService.show('Invalid quantity', '');
            return;
        }
        if (+row.tempInputQuantity > +row.totalAvailableQty) {
            this.toastService.show('Invalid quantity', 'Enter quantity less than available quantity');
            return;
        }
        this.bcViewStockService.checkCategorySerializable(row.category).subscribe(response => {
            if (this.addedStockList.length) {
                if (this.productType !== response.product_type) {
                    this.toastService.show('Unable to add serialized and non serialized items together', '');
                    return;
                }
            } else {
                this.productType = response.product_type;
                this.ownStoreSearchForm.controls.storeID.disable();
            }

            const alreadyAddedRowIndex = this.addedStockList.findIndex(stock => stock.itemDescription === row.itemDescription);
            if (alreadyAddedRowIndex >= 0) {
                if (
                    +row.totalAvailableQty <
                    +row.tempInputQuantity + +this.addedStockList[alreadyAddedRowIndex].tempInputQuantity
                ) {
                    this.toastService.show('Invalid quantity', 'Enter quantity less than available quantity');
                    return;
                }
                this.addedStockList[alreadyAddedRowIndex].tempInputQuantity =
                    (+this.addedStockList[alreadyAddedRowIndex].tempInputQuantity + +row.tempInputQuantity).toString();
            } else {
                this.addedStockList.push({...row});
            }
            row.tempInputQuantity = '';
        });
    }

    onRemoveButtonClick(row: BCStock): void {
        this.addedStockList.splice(this.addedStockList.findIndex(stock => stock.itemDescription === row.itemDescription), 1);
        if (!this.addedStockList.length) {
            this.ownStoreSearchForm.controls.storeID.enable();
        }
    }

    onConfirmButtonClick(): void {
        const request: ConfirmStocks = {
            transfer_to_store_id: (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id,
            comments: null,
            created_by: this.localStorageService.get(StorageSettings.LOGIN_NAME),
            serial: this.productType === 'SERIAL',
            transfer_from_store_id: this.bcSearchRequest.store_id,
            transfer_item_list: this.addedStockList.map<TransferItemList>(item => {
                return {
                    transfer_to_store_id: (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id,
                    item_name: item.itemDescription,
                    transfer_quantity: +item.tempInputQuantity,
                    sap_material_code: item.sAPMaterialCode
                }
            })
        };
        this.bcViewStockService.confirmStocks(request).subscribe(
            (response) => {
                this.confirmClick.emit(response.request_id?.trim() ?? '');
            }, () => {
                this.toastService.show('Unable to confirm stock request', 'Unable to confirm stock request');
            }
        );
    }

    public storeNameByStoreID(storeID: string): string {
        return storeID ? this.outletList.find(outlet => outlet.outlet_id === storeID)?.outlet_name ?? '' : '';
    }

    private initForm(): void {
        this.ownStoreSearchForm = new FormGroup({
            radio: new FormControl('reload', {validators: []}),
            from: new FormControl('Other Stores', {validators: []}),
            storeID: new FormControl(null, {validators: [Validators.required]}),
            productCategory: new FormControl(null, {validators: []}),
            brand: new FormControl(null, {validators: []}),
            itemName: new FormControl(null, {validators: [Validators.maxLength(100)]}),
            materialCode: new FormControl(null, {validators: [Validators.maxLength(100)]}),
        });
    }

    private retrieveProductCategoryList(val: number): void {
        this.bcViewStockService.getProductCategoryList(val).subscribe(response => {
            this.productCategoryList = response;
            this.ownStoreSearchForm.controls.productCategory.patchValue(this.productCategoryList?.[0].value);
            this.retrieveProductBrandsByCategory(this.ownStoreSearchForm.controls.productCategory.value, true);
        });
    }

    private retrieveOutletListByRegion(regionName: string): void {
        this.bcViewStockService.getStoresByRegions(regionName).subscribe(response => {
            this.outletListByRegion = response.map(outlet => {
                return {
                    region: regionName,
                    outlet_category: outlet.category_name,
                    outlet_name: outlet.store_name,
                    outlet_id: outlet.store_id
                };
            }) ?? [];
            this.outletList = this.outletListByRegion;
            this.outletList = this.outletList
                .filter(outlet => outlet.outlet_id !== (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id);
            this.ownStoreSearchForm.controls.storeID.patchValue(this.outletList?.[0].outlet_id);
        });
    }

    private retrieveProductBrandsByCategory(categoryValue: string, isPageLoad?: boolean): void {
        this.bcViewStockService.getProductBrandListByCategory(categoryValue).subscribe(response => {
            this.productBrandList = response ?? [];
            if (isPageLoad) {
                this.ownStoreSearchForm.controls.brand.patchValue(this.productBrandList?.[0].value);
            }
        })
    }

    private retrieveSearchResults(): void {
        this.stockResults = new Array<BCStock>();
        this.selectedStock = null;
        this.pageNumber = 1;
        this.bcViewStockService.bcOwnStockSearch(this.bcSearchRequest).subscribe(
            response => {
                if (response?.length) {
                    this.stockResults = response;
                    this.getAddressByOutlet(this.bcSearchRequest?.store_id);
                }
            }, (error: HttpErrorResponse) => {
                if (error.error.code === 500) {
                    this.errorMessage = 'Unable to fetch inventory levels';
                } else {
                    this.errorMessage = error.error.errorMessage;
                    this.toastService.show('Unable to fetch data',  error.error.errorMessage ||'');
                }
            }
        );
    }

    private getAddressByOutlet(outletId: string): void {
        this.bcViewStockService.getMainAddress(outletId).subscribe(response => {
            this.selectedOutletAddress = response?.main_address ?? '';
        })
    }

}
