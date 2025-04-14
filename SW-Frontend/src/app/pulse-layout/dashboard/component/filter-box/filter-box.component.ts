import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FILTER_BOX_DATA, MONTH_DATA, STORE_DATA } from '@app/SW-layout/dashboard/data/data';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { StorageSettings } from '../../../../../constants/StorageSettings';
import { LocalStorageService } from '../../../../../services/local-storage.service';

/**
 * SW filter box component
 * Author: Thilina Kelum
 * Created Date: 2021 July 13
 */
@Component({
    selector: 'SW-filter-box',
    templateUrl: './filter-box.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class FilterBoxComponent implements OnInit {
    @Input() region!: false;
    @Input() date!: false;
    @Input() outlet!: false;
    @Input() store!: false;

    @Output() notifications = new EventEmitter<any[]>();
    @Output() outletSelect = new EventEmitter<any[]>();
    @Output() storeSelect = new EventEmitter<any[]>();
    @Output() regionSelect = new EventEmitter<string>();
    @Output() monthSelect = new EventEmitter<string>();
    @Output() requiredFieldEmpty = new EventEmitter<boolean>();

    regionList: any[] = [];
    outletList: any[] = [];
    selectedRegion: any[] = [];
    selectedOutlets: any[] = [];
    selectedStores: any[] = [];
    selectedMonth = '';
    storeEmpty = false;
    outletsEmpty = false;
    regionEmpty = false;
    outletSettings!: IDropdownSettings;
    regionSettings!: IDropdownSettings;
    storeSettings!: IDropdownSettings;
    monthSettings!: IDropdownSettings;
    regionAndOutletList = FILTER_BOX_DATA;
    monthList = MONTH_DATA;
    storeList = STORE_DATA;

    constructor(private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.regionSettings = {
            singleSelection: true,
            enableCheckAll: false,
            textField: 'region_name',
        };
        this.outletSettings = {
            singleSelection: false,
            enableCheckAll: false,
            idField: 'outlet_id',
            textField: 'outlet_name',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };
        this.storeSettings = {
            singleSelection: false,
            enableCheckAll: false,
            idField: 'outlet_id',
            textField: 'outlet_id',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };
        this.monthSettings = {
            singleSelection: true,
            enableCheckAll: false,
            idField: 'id',
            textField: 'name',
            clearSearchFilter: false,
        };
        this.setFilterInitialData();
    }

    /**
     * Sets filter initial data
     */
    setFilterInitialData() {
        if(this.localStorageService.getPermissions().includes('KPI_DASHBOARD_BC')){
            this.regionAndOutletList = this.localStorageService.getRegionAndOutlets();
            if (this.regionAndOutletList != null) {
                this.regionAndOutletList.forEach((value: { region: string }) => {
                    this.regionList.push(value.region);
                });
            }
            if (this.regionAndOutletList != null) {
                if (this.regionList != null) {
                    this.regionAndOutletList.forEach((value: { region: string; outlets: any[] }) => {
                        if (value.region === this.regionList[0]) {
                        this.outletList = value.outlets;
                        }
                    });
                }
            }

        }
        if(this.localStorageService.getPermissions().includes('KPI_DASHBOARD_DEALER')) {
            const storeString = localStorage.getItem(StorageSettings.OUTLETS);
            if (storeString != null) {
                this.storeList = JSON.parse(storeString);
            }
        }

        // set region, outlet, store default data
        this.selectedRegion.push(this.regionList[0]);
        this.selectedOutlets.push(this.outletList[0]);
        this.selectedStores.push(this.storeList[0]);
        this.onStoreChange();
        this.onOutletChange();
    }

    /**
     * Determines whether region select on
     * @param region
     */
    onRegionSelect(region: any) {
        this.regionEmpty = false;
        this.requiredFieldEmpty.emit(false);
        this.regionAndOutletList.forEach((value: { region: any; outlets: any[] }) => {
            if (value.region === region) {
                this.outletList = value.outlets;
                this.selectedOutlets = [];
                this.selectedOutlets.push(this.outletList[0]);
                this.outletsEmpty = false;
            }
        });
    }

    /**
     * Determines whether region de select on
     */
    onRegionDeSelect() {
        this.outletList = [];
        this.selectedOutlets = [];
        this.regionEmpty = true;
        this.requiredFieldEmpty.emit(true);
        this.onOutletChange();
    }

    /**
     * Determines whether outlet change on
     */
    onOutletChange() {
        if (this.selectedOutlets.length > 0) {
            this.outletsEmpty = false;
            this.outletSelect.emit(this.selectedOutlets);
            this.requiredFieldEmpty.emit(false);
        } else {
            this.outletsEmpty = true;
            this.requiredFieldEmpty.emit(true);
        }
    }

    /**
     * Determines whether store change on
     */
    onStoreChange() {
        if (this.selectedStores.length > 0) {
            this.storeEmpty = false;
            this.storeSelect.emit(this.selectedStores);
            this.requiredFieldEmpty.emit(false);
        } else {
            this.storeEmpty = true;
            this.requiredFieldEmpty.emit(true);
        }
    }

    /**
     * Sets year and month
     * @param yearAndMonth
     */
    setYearAndMonth(yearAndMonth: string) {
        this.selectedMonth = yearAndMonth;
        this.monthSelect.emit(this.selectedMonth);
    }
}
