import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

import { OutletList, Regions } from '../../../models/region';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'SW-bc-search-stock',
    templateUrl: './bc-search-stock.component.html',
    styleUrls: ['./bc-search-stock.component.scss']
})
export class BcSearchStockComponent implements OnInit {

    public displayedScreen: 'search' | 'stock-level-detail' = 'search';

    public productCategoryList = new Array<ProductCategory>();
    public productBrandListOwnStore = new Array<ProductBrand>();
    public productBrandListOtherStore = new Array<ProductBrand>();
    public regionsList = new Array<Regions>();
    public outletList = new Array<OutletList>();
    public otherStoreOutletList = new Array<OutletList>();

    public ownStoreSearchForm = new FormGroup({});
    public otherStoreSearchForm = new FormGroup({});

    public pageNumber = 1;

    public storeID = '';
    public storeName = '';
    public outletStoreDetails?: Outlets;
    public bcSearchRequest!: BCStockSearchRequest;
    public selectedStock: BCStock | null = null;
    public stockResults = new Array<BCStock>();
    public showAlert = false;

    public errorMessage = 'It seems like there’s an issue getting the data.';

    constructor(
        private toastService: ToastService,
        private bcViewStockService: BcViewStockService,
        private localStorageService: LocalStorageService,
        private satisfactionSurveyService: SatisfactionSurveyService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.retrieveProductCategoryList();
        this.outletStoreDetails = (this.localStorageService.getOutlets() as Array<Outlets>)?.[0] ?? null;
        this.storeID = this.outletStoreDetails?.outlet_id as string;
        this.storeName = this.outletStoreDetails?.outlet_name as string;
        this.retrieveRegionList();
    }

    onTabChange(value: string): void {
        if (value === 'Own Store') {
            this.storeID = this.outletStoreDetails?.outlet_id as string;
            this.storeName = this.outletStoreDetails?.outlet_name as string;
            this.resetResults(true);
        } else if (value === 'Other Store') {
            this.storeID = this.otherStoreSearchForm.value.storeId;
            this.storeName = this.outletList.find(outlet => outlet.store_id === this.otherStoreSearchForm.value.storeId)?.store_name ?? '';
            this.resetResults(true);
        }
    }

    onSelectProductCategory(value: string, type: 'own-store' | 'other-store'): void {
        if (type === 'own-store') {
            this.ownStoreSearchForm.controls.brand.patchValue(null);
            this.retrieveProductBrandsByCategory(value, type);
        } else if (type === 'other-store') {
            this.otherStoreSearchForm.controls.brand.patchValue(null);
            this.retrieveProductBrandsByCategory(value, type);
            this.stockResults = new Array<BCStock>();
        }
    }

    onSelectRegion(value: string) {
        this.storeName = '';
        this.storeID = '';
        this.otherStoreSearchForm.controls.storeId.patchValue(null);
        this.outletList = this.regionsList.find(r => r.region_name === value)?.outlet_list || [];
        this.retrieveStoreListByRegion(value);
        }

    onSelectStoreID(value: string) {
        this.storeID = value;
        this.storeName = this.outletList.find(outlet => outlet.store_id === value)?.store_name ?? '';
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
            store_id: this.outletStoreDetails?.outlet_id as string,
        }
        this.retrieveSearchResults();
    }

    onSearchOtherStore(): void {
        if (this.otherStoreSearchForm.invalid) {
            this.otherStoreSearchForm.markAllAsTouched();
            return;
        }
        this.bcSearchRequest = {
            brand: this.otherStoreSearchForm.value.brand,
            category: this.otherStoreSearchForm.value.productCategory,
            item_name: this.otherStoreSearchForm.value.itemName,
            material_code: this.otherStoreSearchForm.value.materialCode,
            store_id: this.otherStoreSearchForm.value.storeId,
        }
        this.retrieveSearchResults();
    }

    onSelectButtonClick(stock: BCStock): void {
        if (stock.serial) {
            this.selectedStock = stock;
            this.displayedScreen = 'stock-level-detail';
            this.showAlert = false;
        } else {
            this.showAlert = true;
        }

    }

    onExportOwnStoreClick(): void {
        this.bcViewStockService.bcOwnStockExport(this.bcSearchRequest);
    }

    onDownloadSummaryDetail(type: string) {
        this.bcViewStockService.downloadBCReportSummary(
            this.localStorageService.get(StorageSettings.LOGIN_NAME), type, this.storeID
        ).subscribe((response: any) => {
            const file = new Blob([response.body as BlobPart], {type: 'text/csv'});
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = fileURL;
            if (type === 'Detail') {
                a.download = 'Outlet_Balance_Detail_'+ this.storeID+ '.csv'
            } else {
                a.download = 'Outlet_Balance_Summary_'+ this.storeID+ '.csv'
            }
            a.click();
            document.body.removeChild(a);
        }, (error) => {
            this.toastService.show('Unable to download', error.error.errorMessage || '');
        });
    }

    private initForm(): void {
        this.ownStoreSearchForm = new FormGroup({
            productCategory: new FormControl(null, {validators: []}),
            brand: new FormControl(null, {validators: []}),
            itemName: new FormControl(null, {validators: [Validators.maxLength(100)]}),
            materialCode: new FormControl(null, {validators: [Validators.maxLength(100)]}),
        });

        this.otherStoreSearchForm = new FormGroup({
            region: new FormControl(null, {validators: [Validators.required]}),
            storeId: new FormControl(null, {validators: [Validators.required]}),
            productCategory: new FormControl(null, {validators: []}),
            brand: new FormControl(null, {validators: []}),
            itemName: new FormControl(null, {validators: [Validators.maxLength(100)]}),
            materialCode: new FormControl(null, {validators: [Validators.maxLength(100)]}),
        });
    }

    private retrieveProductCategoryList(): void {
        this.bcViewStockService.getProductCategoryList(2).subscribe(response => {
            this.productCategoryList = response;
        });
    }

    private retrieveProductBrandsByCategory(categoryValue: string, type: 'own-store' | 'other-store'): void {
        this.bcViewStockService.getProductBrandListByCategory(categoryValue).subscribe(response => {
            if (type === 'own-store') {
                this.productBrandListOwnStore = response;
            } else if (type === 'other-store') {
                this.productBrandListOtherStore = response;
            }
        })
    }

    private retrieveRegionList(): void {
        this.bcViewStockService.getRegions().subscribe(response => {
            this.regionsList = response;
            this.otherStoreSearchForm.controls.region.patchValue(this.regionsList[0].region_name);
            this.outletList = this.regionsList.find(r => r.region_name === this.regionsList[0].region_name)?.outlet_list || [];
            this.retrieveStoreListByRegion(this.regionsList[0].region_name, true);
        });
    }

    private retrieveStoreListByRegion(region_name:string, isPageLoad?: boolean): void {
        this.bcViewStockService.getStoresByRegions(region_name).subscribe(response => {
            this.otherStoreOutletList = response;
            this.otherStoreOutletList = this.otherStoreOutletList
                .filter(outlet => outlet.store_id !== (this.localStorageService.getOutlets() as Array<Outlets>)?.[0].outlet_id);
            this.otherStoreSearchForm.controls.storeId.patchValue(this.otherStoreOutletList[0].store_id);
            if (!isPageLoad) {
                this.storeName = this.otherStoreOutletList[0].store_name;
                this.storeID = this.otherStoreOutletList[0].store_id;
            }
        });
    }

    private retrieveSearchResults(): void {
        this.resetResults();
        this.bcViewStockService.bcOwnStockSearch(this.bcSearchRequest).subscribe(
            response => {
                if (response?.length) {
                    this.stockResults = response;
                    this.showAlert = false;
                    // trigger point
                    this.satisfactionSurveyService.show("INVENTORY_BC")
                }
            }, (error: HttpErrorResponse) => {
                if (error.error.code === 500) {
                    this.errorMessage = 'Unable to fetch inventory levels';
                } else {
                    this.errorMessage = error.error.errorMessage;
                }
                this.toastService.show('Unable to fetch data',  error.error.errorMessage ||'');
            }
        );
    }

    private resetResults(changeErrorMessage?: boolean): void {
        this.stockResults = new Array<BCStock>();
        this.selectedStock = null;
        this.pageNumber = 1;
        if (changeErrorMessage) {
            this.errorMessage = 'It seems like there’s an issue getting the data.';
        }
    }

    loadPage(){
        this.showAlert = false;
    }
}
