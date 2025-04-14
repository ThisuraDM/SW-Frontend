import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    BCStock,
    BCStockSearchRequest,
    ProductBrand,
    ProductCategory,
} from '@app/SW-layout/inventory/models/bc-view-stock';
import { BcViewStockService } from '@app/SW-layout/inventory/services/bc-view-stock.service';
import { ToastService } from '@common/services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StorageSettings } from 'constants/StorageSettings';

import { Outlets } from '../../../../../../models/login-details';
import { LocalStorageService } from '../../../../../../services/local-storage.service';
import { SatisfactionSurveyService } from '@app/SW-layout/satisfaction-survey/services/satisfaction-survey.service';

@Component({
    selector: 'SW-dealer-search-stock',
    templateUrl: './dealer-search-stock.component.html',
    styleUrls: ['./dealer-search-stock.component.scss']
})
export class DealerSearchStockComponent implements OnInit {

    public displayedScreen: 'search' | 'stock-level-detail' = 'search';

    public productCategoryList = new Array<ProductCategory>();
    public productBrandList = new Array<ProductBrand>();

    public storeID = '';
    public storeName = '';
    public outletList = new Array<Outlets>();
    public selectedReportType = '';
    public selectedOutletId = '';
    public pageNumber = 1;

    public searchForm = new FormGroup({});

    public searchRequest!: BCStockSearchRequest;
    public selectedStock: BCStock | null = null;
    public stockResults = new Array<BCStock>();

    public errorMessage = 'It seems like there’s an issue getting the data.';

    @ViewChild('dwnpopup', {static: true}) confirmPopup!: TemplateRef<any>;

    constructor(
        private toastService: ToastService,
        private bcViewStockService: BcViewStockService,
        private localStorageService: LocalStorageService,
        private modalService: NgbModal,
        private satisfactionSurveyService: SatisfactionSurveyService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.retrieveProductCategoryList();
        this.outletList = (this.localStorageService.getOutlets() as Array<Outlets>) ?? [];
        this.storeID = this.outletList[0]?.outlet_id as string;
        this.storeName = this.outletList[0]?.outlet_name as string;
        this.searchForm.controls.storeId.patchValue(this.storeID);
        this.selectedOutletId = this.outletList[0]?.outlet_id as string;
    }

    onSelectProductCategory(value: string): void {
        this.searchForm.controls.brand.patchValue(null);
        this.retrieveProductBrandsByCategory(value);
    }

    onSelectStoreID(value: string) {
        this.storeID = value;
        this.storeName = this.outletList.find(outlet => outlet.outlet_id === value)?.outlet_name ?? '';
    }

    onSearch() {
        if (this.searchForm.invalid) {
            this.searchForm.markAllAsTouched();
            return;
        }
        this.searchRequest = {
            brand: this.searchForm.value.brand,
            category: this.searchForm.value.productCategory,
            item_name: this.searchForm.value.itemName,
            material_code: this.searchForm.value.materialCode,
            store_id: this.storeID,
        }
        this.retrieveSearchResults();
    }

    onSelectButtonClick(stock: BCStock): void {
        this.selectedStock = stock;
        this.displayedScreen = 'stock-level-detail';
    }

    onExportClick(): void {
        this.bcViewStockService.bcOwnStockExport(this.searchRequest);
    }

    onDownloadSummaryDetail(type: string) {
        this.selectedReportType = type;
        if (this.outletList?.length > 1) {
            const ngbModalOptions: NgbModalOptions = {
                backdrop: 'static',
                keyboard: false,
                centered: true
            };
            this.modalService.open(this.confirmPopup, ngbModalOptions);
        } else {
            this.bcViewStockService
                .downloadDealerReportSummary(this.localStorageService.get(StorageSettings.LOGIN_NAME), type, this.storeID)
                .subscribe((response: any) => {
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
                    this.toastService.show('Unable to download',  error.error.errorMessage||'');
                });
        }
    }

    confirmDownload() {
        this.bcViewStockService
            .downloadDealerReportSummary(
                this.localStorageService.get(StorageSettings.LOGIN_NAME),
                this.selectedReportType, this.selectedOutletId
            )
            .subscribe((response: any) => {
                const file = new Blob([response.body as BlobPart], {type: 'text/csv'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }, (error) => {
                this.toastService.show('Unable to download',  error.error.errorMessage||'');
            });
    }

    private initForm() {
        this.searchForm = new FormGroup({
            storeId: new FormControl(null, {
                validators:
                    this.outletList.length > 1 ? [Validators.required] : []
            }),
            productCategory: new FormControl(null, {validators: [Validators.required]}),
            brand: new FormControl(null, {validators: []}),
            itemName: new FormControl(null, {validators: [Validators.maxLength(100)]}),
            materialCode: new FormControl(null, {validators: [Validators.maxLength(100)]}),
        });
    }

    private retrieveProductCategoryList(): void {
        this.bcViewStockService.getProductCategoryList(1).subscribe(response => {
            this.productCategoryList = response;
        });
    }

    private retrieveProductBrandsByCategory(categoryValue: string): void {
        this.bcViewStockService.getProductBrandListByCategory(categoryValue).subscribe(response => {
            this.productBrandList = response;
        })
    }

    private retrieveSearchResults(): void {
        this.stockResults = new Array<BCStock>();
        this.selectedStock = null;
        this.pageNumber = 1;
        this.bcViewStockService.bcOwnStockSearch(this.searchRequest).subscribe(
            response => {
                if (response?.length) {
                    this.stockResults = response;
                    this.satisfactionSurveyService.show("VIEW_STOCK");
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
}

